import express from 'express';
import { prisma } from '../index';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { validateAppointment } from '../utils/validation';

const router = express.Router();

// Listar agendamentos do usuário logado
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let appointments;

    if (userRole === 'CLIENT') {
      // Cliente vê apenas seus agendamentos
      appointments = await prisma.appointment.findMany({
        where: { clientId: userId },
        include: {
          service: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    } else if (userRole === 'PROVIDER') {
      // Provider vê agendamentos de seus serviços
      appointments = await prisma.appointment.findMany({
        where: {
          service: {
            providerId: userId
          }
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          service: true
        },
        orderBy: { date: 'desc' }
      });
    } else {
      // Admin vê todos os agendamentos
      appointments = await prisma.appointment.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          service: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    }

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar agendamento por ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar permissões
    const hasPermission = 
      userRole === 'ADMIN' ||
      appointment.clientId === userId ||
      appointment.service.providerId === userId;

    if (!hasPermission) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo agendamento
router.post('/', authenticateToken, validateAppointment, async (req: AuthRequest, res) => {
  try {
    const { serviceId, date, notes } = req.body;
    const clientId = req.user!.id;

    // Verificar se o serviço existe e está ativo
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: true
      }
    });

    if (!service || !service.active) {
      return res.status(404).json({ error: 'Serviço não encontrado ou inativo' });
    }

    // Verificar se a data não é no passado
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: 'Não é possível agendar para datas passadas' });
    }

    // Verificar se já existe agendamento no mesmo horário
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        serviceId,
        date: appointmentDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Horário já está ocupado' });
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        serviceId,
        date: appointmentDate,
        notes,
        status: 'PENDING'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // TODO: Enviar notificação para o provider

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do agendamento
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar permissões
    const canUpdateStatus = 
      userRole === 'ADMIN' ||
      (userRole === 'PROVIDER' && appointment.service.providerId === userId) ||
      (userRole === 'CLIENT' && appointment.clientId === userId && status === 'CANCELLED');

    if (!canUpdateStatus) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Status do agendamento atualizado com sucesso',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Erro ao atualizar status do agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar agendamento
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar permissões
    const canCancel = 
      userRole === 'ADMIN' ||
      appointment.clientId === userId ||
      (userRole === 'PROVIDER' && appointment.service.providerId === userId);

    if (!canCancel) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;