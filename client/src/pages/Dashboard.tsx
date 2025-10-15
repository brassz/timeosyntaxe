import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  Business,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsService } from '../services/appointments';
import { servicesService } from '../services/services';
import { Appointment, Service } from '../types';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, servicesData] = await Promise.all([
          appointmentsService.getAppointments(),
          user?.role === 'PROVIDER' ? servicesService.getMyServices() : servicesService.getServices(),
        ]);
        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.role]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      case 'COMPLETED':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getDateLabel = (date: string) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) {
      return 'Hoje';
    } else if (isTomorrow(appointmentDate)) {
      return 'Amanhã';
    }
    return format(appointmentDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const stats = {
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(apt => apt.status === 'CONFIRMED').length,
    pendingAppointments: appointments.filter(apt => apt.status === 'PENDING').length,
    totalServices: services.length,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Bem-vindo, {user?.name}!
      </Typography>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Agendamentos
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Confirmados
                  </Typography>
                  <Typography variant="h5">
                    {stats.confirmedAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pendentes
                  </Typography>
                  <Typography variant="h5">
                    {stats.pendingAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Serviços
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalServices}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Próximos Agendamentos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Próximos Agendamentos
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/appointments')}
              >
                Ver Todos
              </Button>
            </Box>
            {upcomingAppointments.length > 0 ? (
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1">
                            {user?.role === 'CLIENT' 
                              ? appointment.service.name 
                              : appointment.client.name
                            }
                          </Typography>
                          <Chip
                            label={getStatusText(appointment.status)}
                            color={getStatusColor(appointment.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {getDateLabel(appointment.date)} às {format(new Date(appointment.date), 'HH:mm')}
                          </Typography>
                          {user?.role === 'CLIENT' && (
                            <Typography variant="body2" color="textSecondary">
                              com {appointment.service.provider.name}
                            </Typography>
                          )}
                          {appointment.notes && (
                            <Typography variant="body2" color="textSecondary">
                              {appointment.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary" textAlign="center" py={4}>
                Nenhum agendamento próximo
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Ações Rápidas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/appointments/new')}
              >
                Novo Agendamento
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/services')}
              >
                Ver Serviços
              </Button>
              {(user?.role === 'PROVIDER' || user?.role === 'ADMIN') && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/availability')}
                  >
                    Gerenciar Disponibilidade
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/services/new')}
                  >
                    Criar Serviço
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;