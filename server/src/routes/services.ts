import express from 'express';
import { prisma } from '../index';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { validateService } from '../utils/validation';

const router = express.Router();

// Listar todos os serviços ativos
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar serviço por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo serviço (apenas providers e admins)
router.post('/', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validateService, async (req: AuthRequest, res) => {
  try {
    const { name, description, duration, price } = req.body;
    const providerId = req.user!.id;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        providerId
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Serviço criado com sucesso',
      service
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar serviço
router.put('/:id', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validateService, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, active } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Verificar permissões (provider só pode editar seus próprios serviços)
    if (userRole === 'PROVIDER' && existingService.providerId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        duration,
        price,
        active
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Serviço atualizado com sucesso',
      service
    });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Desativar serviço
router.delete('/:id', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Verificar permissões
    if (userRole === 'PROVIDER' && existingService.providerId !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.service.update({
      where: { id },
      data: { active: false }
    });

    res.json({ message: 'Serviço desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao desativar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar serviços do provider logado
router.get('/my/services', authenticateToken, requireRole(['PROVIDER', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const providerId = req.user!.id;

    const services = await prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços do provider:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;