import express from 'express';
import { prisma } from '../index';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { validateAvailability } from '../utils/validation';

const router = express.Router();

// Listar disponibilidade de um provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;

    const availability = await prisma.availability.findMany({
      where: {
        providerId,
        active: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    res.json(availability);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar horários disponíveis para agendamento
router.get('/slots/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    // Buscar o serviço e provider
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: {
          include: {
            availability: {
              where: { active: true }
            }
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const targetDate = new Date(date as string);
    const dayOfWeek = targetDate.getDay();

    // Buscar disponibilidade para o dia da semana
    const dayAvailability = service.provider.availability.filter(
      av => av.dayOfWeek === dayOfWeek
    );

    if (dayAvailability.length === 0) {
      return res.json({ availableSlots: [] });
    }

    // Buscar agendamentos existentes para a data
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        serviceId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });

    // Gerar slots disponíveis
    const availableSlots: string[] = [];
    const serviceDuration = service.duration;

    for (const availability of dayAvailability) {
      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);

      const startTime = startHour * 60 + startMinute; // em minutos
      const endTime = endHour * 60 + endMinute; // em minutos

      // Gerar slots de acordo com a duração do serviço
      for (let time = startTime; time + serviceDuration <= endTime; time += serviceDuration) {
        const hour = Math.floor(time / 60);
        const minute = time % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Verificar se não há conflito com agendamentos existentes
        const slotDateTime = new Date(targetDate);
        slotDateTime.setHours(hour, minute, 0, 0);

        const hasConflict = existingAppointments.some(appointment => {
          const appointmentTime = new Date(appointment.date);
          return appointmentTime.getTime() === slotDateTime.getTime();
        });

        if (!hasConflict && slotDateTime > new Date()) {
          availableSlots.push(timeString);
        }
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Erro ao buscar slots disponíveis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar disponibilidade do provider logado
router.get('/my', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const providerId = req.user!.id;

    const availability = await prisma.availability.findMany({
      where: { providerId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    res.json(availability);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova disponibilidade
router.post('/', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validateAvailability, async (req: AuthRequest, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;
    const providerId = req.user!.id;

    // Verificar se já existe disponibilidade para este dia e horário
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        providerId,
        dayOfWeek,
        startTime,
        endTime,
        active: true
      }
    });

    if (existingAvailability) {
      return res.status(400).json({ error: 'Disponibilidade já existe para este horário' });
    }

    // Validar se o horário de início é menor que o de fim
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (startHour * 60 + startMinute >= endHour * 60 + endMinute) {
      return res.status(400).json({ error: 'Horário de início deve ser menor que o de fim' });
    }

    const availability = await prisma.availability.create({
      data: {
        providerId,
        dayOfWeek,
        startTime,
        endTime
      }
    });

    res.status(201).json({
      message: 'Disponibilidade criada com sucesso',
      availability
    });
  } catch (error) {
    console.error('Erro ao criar disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar disponibilidade
router.put('/:id', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validateAvailability, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, active } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const existingAvailability = await prisma.availability.findUnique({
      where: { id }
    });

    if (!existingAvailability) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada' });
    }

    // Verificar permissões
    if (userRole === 'PROVIDER' && existingAvailability.providerId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Validar horários
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (startHour * 60 + startMinute >= endHour * 60 + endMinute) {
      return res.status(400).json({ error: 'Horário de início deve ser menor que o de fim' });
    }

    const availability = await prisma.availability.update({
      where: { id },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        active
      }
    });

    res.json({
      message: 'Disponibilidade atualizada com sucesso',
      availability
    });
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Remover disponibilidade
router.delete('/:id', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const existingAvailability = await prisma.availability.findUnique({
      where: { id }
    });

    if (!existingAvailability) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada' });
    }

    // Verificar permissões
    if (userRole === 'PROVIDER' && existingAvailability.providerId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.availability.update({
      where: { id },
      data: { active: false }
    });

    res.json({ message: 'Disponibilidade removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;