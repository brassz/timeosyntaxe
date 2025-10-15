import nodemailer from 'nodemailer';
import { Appointment, User } from '@prisma/client';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(data: EmailData): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      console.log(`Email enviado para ${data.to}: ${data.subject}`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  async sendAppointmentConfirmation(appointment: any): Promise<void> {
    const subject = 'Agendamento Confirmado';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Agendamento Confirmado</h2>
        <p>Olá ${appointment.client.name},</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes do Agendamento:</h3>
          <p><strong>Serviço:</strong> ${appointment.service.name}</p>
          <p><strong>Data:</strong> ${new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Duração:</strong> ${appointment.service.duration} minutos</p>
          <p><strong>Prestador:</strong> ${appointment.service.provider.name}</p>
          ${appointment.notes ? `<p><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
        </div>
        
        <p>Em caso de dúvidas, entre em contato conosco.</p>
        <p>Atenciosamente,<br>Sistema de Agendamentos</p>
      </div>
    `;

    await this.sendEmail({
      to: appointment.client.email,
      subject,
      html,
    });
  }

  async sendAppointmentCancellation(appointment: any): Promise<void> {
    const subject = 'Agendamento Cancelado';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc004e;">Agendamento Cancelado</h2>
        <p>Olá ${appointment.client.name},</p>
        <p>Informamos que seu agendamento foi cancelado.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes do Agendamento Cancelado:</h3>
          <p><strong>Serviço:</strong> ${appointment.service.name}</p>
          <p><strong>Data:</strong> ${new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Prestador:</strong> ${appointment.service.provider.name}</p>
        </div>
        
        <p>Você pode agendar um novo horário quando desejar.</p>
        <p>Atenciosamente,<br>Sistema de Agendamentos</p>
      </div>
    `;

    await this.sendEmail({
      to: appointment.client.email,
      subject,
      html,
    });
  }

  async sendNewAppointmentNotification(appointment: any): Promise<void> {
    const subject = 'Novo Agendamento Recebido';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Novo Agendamento</h2>
        <p>Olá ${appointment.service.provider.name},</p>
        <p>Você recebeu um novo agendamento!</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes do Agendamento:</h3>
          <p><strong>Cliente:</strong> ${appointment.client.name}</p>
          <p><strong>Email:</strong> ${appointment.client.email}</p>
          ${appointment.client.phone ? `<p><strong>Telefone:</strong> ${appointment.client.phone}</p>` : ''}
          <p><strong>Serviço:</strong> ${appointment.service.name}</p>
          <p><strong>Data:</strong> ${new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Duração:</strong> ${appointment.service.duration} minutos</p>
          ${appointment.notes ? `<p><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
        </div>
        
        <p>Acesse o sistema para confirmar ou gerenciar este agendamento.</p>
        <p>Atenciosamente,<br>Sistema de Agendamentos</p>
      </div>
    `;

    await this.sendEmail({
      to: appointment.service.provider.email,
      subject,
      html,
    });
  }

  async sendAppointmentReminder(appointment: any): Promise<void> {
    const subject = 'Lembrete: Agendamento Amanhã';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Lembrete de Agendamento</h2>
        <p>Olá ${appointment.client.name},</p>
        <p>Este é um lembrete sobre seu agendamento de amanhã.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes do Agendamento:</h3>
          <p><strong>Serviço:</strong> ${appointment.service.name}</p>
          <p><strong>Data:</strong> ${new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Duração:</strong> ${appointment.service.duration} minutos</p>
          <p><strong>Prestador:</strong> ${appointment.service.provider.name}</p>
          ${appointment.notes ? `<p><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
        </div>
        
        <p>Não esqueça do seu compromisso!</p>
        <p>Atenciosamente,<br>Sistema de Agendamentos</p>
      </div>
    `;

    await this.sendEmail({
      to: appointment.client.email,
      subject,
      html,
    });
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    const subject = 'Bem-vindo ao Sistema de Agendamentos';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Bem-vindo!</h2>
        <p>Olá ${user.name},</p>
        <p>Seja bem-vindo ao Sistema de Agendamentos!</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Sua conta foi criada com sucesso:</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Tipo de conta:</strong> ${user.role === 'CLIENT' ? 'Cliente' : user.role === 'PROVIDER' ? 'Prestador de Serviços' : 'Administrador'}</p>
        </div>
        
        <p>Agora você pode:</p>
        <ul>
          ${user.role === 'CLIENT' ? `
            <li>Agendar serviços</li>
            <li>Visualizar seus agendamentos</li>
            <li>Gerenciar seu perfil</li>
          ` : `
            <li>Gerenciar seus serviços</li>
            <li>Definir sua disponibilidade</li>
            <li>Acompanhar seus agendamentos</li>
          `}
        </ul>
        
        <p>Acesse o sistema e comece a usar agora mesmo!</p>
        <p>Atenciosamente,<br>Sistema de Agendamentos</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();