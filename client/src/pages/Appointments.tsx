import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Add,
  CalendarToday,
  AccessTime,
  Person,
  Business,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from '../services/appointments';
import { useAuth } from '../contexts/AuthContext';
import { Appointment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentsService.getAppointments();
      setAppointments(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedAppointment(null);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      await appointmentsService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointments();
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleCancel = async (appointmentId: string) => {
    setActionLoading(true);
    try {
      await appointmentsService.cancelAppointment(appointmentId);
      await fetchAppointments();
      toast.success('Agendamento cancelado com sucesso');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento');
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const openDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
    handleMenuClose();
  };

  const canUpdateStatus = (appointment: Appointment) => {
    return (user?.role === 'PROVIDER' && user.id === appointment.service.provider?.id) ||
           user?.role === 'ADMIN';
  };

  const canCancel = (appointment: Appointment) => {
    return appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' &&
           (user?.id === appointment.clientId || 
            (user?.role === 'PROVIDER' && user.id === appointment.service.provider?.id) ||
            user?.role === 'ADMIN');
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Agendamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/appointments/new')}
        >
          Novo Agendamento
        </Button>
      </Box>

      {appointments.length === 0 ? (
        <Alert severity="info">
          Nenhum agendamento encontrado. Que tal criar o primeiro?
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={getStatusText(appointment.status)}
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, appointment)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {format(new Date(appointment.date), 'HH:mm')}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {appointment.service.name}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {user?.role === 'CLIENT' 
                        ? appointment.service.provider?.name || 'Provider'
                        : appointment.client.name
                      }
                    </Typography>
                  </Box>

                  {appointment.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{appointment.notes}"
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de ações */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedAppointment && openDetails(selectedAppointment)}>
          Ver Detalhes
        </MenuItem>
        
        {selectedAppointment && canUpdateStatus(selectedAppointment) && (
          <>
            {selectedAppointment.status === 'PENDING' && (
              <MenuItem 
                onClick={() => handleStatusChange(selectedAppointment.id, 'CONFIRMED')}
                disabled={actionLoading}
              >
                Confirmar
              </MenuItem>
            )}
            {selectedAppointment.status === 'CONFIRMED' && (
              <MenuItem 
                onClick={() => handleStatusChange(selectedAppointment.id, 'COMPLETED')}
                disabled={actionLoading}
              >
                Marcar como Concluído
              </MenuItem>
            )}
          </>
        )}
        
        {selectedAppointment && canCancel(selectedAppointment) && (
          <MenuItem 
            onClick={() => handleCancel(selectedAppointment.id)}
            disabled={actionLoading}
            sx={{ color: 'error.main' }}
          >
            Cancelar
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de detalhes */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Detalhes do Agendamento
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedAppointment.service.name}
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={getStatusText(selectedAppointment.status)}
                  color={getStatusColor(selectedAppointment.status) as any}
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Data e Hora
                </Typography>
                <Typography variant="body1">
                  {format(new Date(selectedAppointment.date), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {user?.role === 'CLIENT' ? 'Prestador' : 'Cliente'}
                </Typography>
                <Typography variant="body1">
                  {user?.role === 'CLIENT' 
                    ? selectedAppointment.service.provider?.name || 'Provider'
                    : selectedAppointment.client.name
                  }
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Duração
                </Typography>
                <Typography variant="body1">
                  {selectedAppointment.service.duration} minutos
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Preço
                </Typography>
                <Typography variant="body1">
                  R$ {selectedAppointment.service.price.toFixed(2)}
                </Typography>
              </Box>

              {selectedAppointment.notes && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Observações
                  </Typography>
                  <Typography variant="body1">
                    {selectedAppointment.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;