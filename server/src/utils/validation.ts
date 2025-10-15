import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validações para autenticação
export const validateRegister = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  handleValidationErrors
];

// Validações para serviços
export const validateService = [
  body('name').notEmpty().withMessage('Nome do serviço é obrigatório'),
  body('duration').isInt({ min: 1 }).withMessage('Duração deve ser um número positivo'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  handleValidationErrors
];

// Validações para agendamentos
export const validateAppointment = [
  body('serviceId').notEmpty().withMessage('Serviço é obrigatório'),
  body('date').isISO8601().withMessage('Data inválida'),
  handleValidationErrors
];

// Validações para disponibilidade
export const validateAvailability = [
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Dia da semana inválido'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário de início inválido'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário de fim inválido'),
  handleValidationErrors
];