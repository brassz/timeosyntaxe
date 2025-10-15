import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agendamentos.com' },
    update: {},
    create: {
      email: 'admin@agendamentos.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar provider de exemplo
  const providerPassword = await bcrypt.hash('provider123', 12);
  const provider = await prisma.user.upsert({
    where: { email: 'provider@agendamentos.com' },
    update: {},
    create: {
      email: 'provider@agendamentos.com',
      password: providerPassword,
      name: 'João Silva',
      phone: '(11) 99999-9999',
      role: 'PROVIDER'
    }
  });

  console.log('✅ Provider criado:', provider.email);

  // Criar cliente de exemplo
  const clientPassword = await bcrypt.hash('client123', 12);
  const client = await prisma.user.upsert({
    where: { email: 'client@agendamentos.com' },
    update: {},
    create: {
      email: 'client@agendamentos.com',
      password: clientPassword,
      name: 'Maria Santos',
      phone: '(11) 88888-8888',
      role: 'CLIENT'
    }
  });

  console.log('✅ Cliente criado:', client.email);

  // Criar serviços de exemplo
  const services = [
    {
      name: 'Corte de Cabelo',
      description: 'Corte moderno e estilizado',
      duration: 60,
      price: 50.00,
      providerId: provider.id
    },
    {
      name: 'Barba',
      description: 'Aparar e modelar barba',
      duration: 30,
      price: 25.00,
      providerId: provider.id
    },
    {
      name: 'Corte + Barba',
      description: 'Pacote completo de corte e barba',
      duration: 90,
      price: 70.00,
      providerId: provider.id
    },
    {
      name: 'Massagem Relaxante',
      description: 'Massagem terapêutica para relaxamento',
      duration: 60,
      price: 80.00,
      providerId: provider.id
    }
  ];

  for (const serviceData of services) {
    const service = await prisma.service.upsert({
      where: {
        name_providerId: {
          name: serviceData.name,
          providerId: serviceData.providerId
        }
      },
      update: {},
      create: serviceData
    });
    console.log('✅ Serviço criado:', service.name);
  }

  // Criar disponibilidade de exemplo (Segunda a Sexta, 9h às 17h)
  const availabilityData = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }, // Segunda manhã
    { dayOfWeek: 1, startTime: '14:00', endTime: '17:00' }, // Segunda tarde
    { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' }, // Terça manhã
    { dayOfWeek: 2, startTime: '14:00', endTime: '17:00' }, // Terça tarde
    { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' }, // Quarta manhã
    { dayOfWeek: 3, startTime: '14:00', endTime: '17:00' }, // Quarta tarde
    { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' }, // Quinta manhã
    { dayOfWeek: 4, startTime: '14:00', endTime: '17:00' }, // Quinta tarde
    { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }, // Sexta manhã
    { dayOfWeek: 5, startTime: '14:00', endTime: '17:00' }, // Sexta tarde
    { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' }, // Sábado manhã
  ];

  for (const avData of availabilityData) {
    await prisma.availability.upsert({
      where: {
        providerId_dayOfWeek_startTime_endTime: {
          providerId: provider.id,
          dayOfWeek: avData.dayOfWeek,
          startTime: avData.startTime,
          endTime: avData.endTime
        }
      },
      update: {},
      create: {
        ...avData,
        providerId: provider.id
      }
    });
  }

  console.log('✅ Disponibilidade criada para o provider');

  // Criar alguns agendamentos de exemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const servicesCreated = await prisma.service.findMany({
    where: { providerId: provider.id }
  });

  if (servicesCreated.length > 0) {
    await prisma.appointment.create({
      data: {
        clientId: client.id,
        serviceId: servicesCreated[0].id,
        date: tomorrow,
        status: 'CONFIRMED',
        notes: 'Primeiro agendamento de exemplo'
      }
    });

    await prisma.appointment.create({
      data: {
        clientId: client.id,
        serviceId: servicesCreated[1].id,
        date: nextWeek,
        status: 'PENDING',
        notes: 'Segundo agendamento de exemplo'
      }
    });

    console.log('✅ Agendamentos de exemplo criados');
  }

  // Criar notificações de exemplo
  await prisma.notification.create({
    data: {
      userId: client.id,
      senderId: provider.id,
      title: 'Agendamento Confirmado',
      message: 'Seu agendamento para amanhã às 10:00 foi confirmado!',
      type: 'EMAIL'
    }
  });

  await prisma.notification.create({
    data: {
      userId: provider.id,
      senderId: client.id,
      title: 'Novo Agendamento',
      message: 'Você tem um novo agendamento pendente de confirmação.',
      type: 'EMAIL'
    }
  });

  console.log('✅ Notificações de exemplo criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Usuários criados:');
  console.log('Admin: admin@agendamentos.com / admin123');
  console.log('Provider: provider@agendamentos.com / provider123');
  console.log('Cliente: client@agendamentos.com / client123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });