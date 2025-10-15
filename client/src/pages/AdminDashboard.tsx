import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  People,
  Business,
  CalendarToday,
  TrendingUp,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/users';
import { servicesService } from '../services/services';
import { appointmentsService } from '../services/appointments';
import { User, Service, Appointment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersData, servicesData, appointmentsData] = await Promise.all([
        usersService.getUsers(),
        servicesService.getServices(),
        appointmentsService.getAppointments(),
      ]);
      
      setUsers(usersData.data || []);
      setServices(servicesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await usersService.updateUser(selectedUser.id, userData);
      await fetchData();
      setEditUserOpen(false);
      setSelectedUser(null);
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
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

  const getRoleText = (role: string) => {
    switch (role) {
      case 'CLIENT':
        return 'Cliente';
      case 'PROVIDER':
        return 'Prestador';
      case 'ADMIN':
        return 'Admin';
      default:
        return role;
    }
  };

  const stats = {
    totalUsers: users.length,
    totalClients: users.filter(u => u.role === 'CLIENT').length,
    totalProviders: users.filter(u => u.role === 'PROVIDER').length,
    totalServices: services.length,
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(a => a.status === 'CONFIRMED').length,
    pendingAppointments: appointments.filter(a => a.status === 'PENDING').length,
    revenue: appointments
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + a.service.price, 0),
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h5" color="error">
          Acesso negado. Esta página é apenas para administradores.
        </Typography>
      </Box>
    );
  }

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
        Dashboard Administrativo
      </Typography>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Usuários
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalUsers}
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
                <Business color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Serviços
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalServices}
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
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Receita Total
                  </Typography>
                  <Typography variant="h5">
                    R$ {stats.revenue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Usuários" />
            <Tab label="Serviços" />
            <Tab label="Agendamentos" />
          </Tabs>
        </Box>

        {/* Tab Usuários */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Gerenciar Usuários ({stats.totalUsers})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data de Cadastro</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleText(user.role)}
                        color={user.role === 'ADMIN' ? 'error' : user.role === 'PROVIDER' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab Serviços */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Gerenciar Serviços ({stats.totalServices})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Prestador</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de Criação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.provider.name}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={service.active ? 'Ativo' : 'Inativo'}
                        color={service.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(service.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab Agendamentos */}
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Gerenciar Agendamentos ({stats.totalAppointments})
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Serviço</TableCell>
                  <TableCell>Prestador</TableCell>
                  <TableCell>Data/Hora</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.slice(0, 50).map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.client.name}</TableCell>
                    <TableCell>{appointment.service.name}</TableCell>
                    <TableCell>{appointment.service.provider?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>R$ {appointment.service.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Dialog para editar usuário */}
      <Dialog open={editUserOpen} onClose={() => setEditUserOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Nome"
                defaultValue={selectedUser.name}
                id="name"
              />
              <TextField
                margin="normal"
                fullWidth
                label="Telefone"
                defaultValue={selectedUser.phone || ''}
                id="phone"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Usuário</InputLabel>
                <Select
                  defaultValue={selectedUser.role}
                  label="Tipo de Usuário"
                  id="role"
                >
                  <MenuItem value="CLIENT">Cliente</MenuItem>
                  <MenuItem value="PROVIDER">Prestador</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              const form = document.getElementById('name') as HTMLInputElement;
              const phone = document.getElementById('phone') as HTMLInputElement;
              const role = document.getElementById('role') as HTMLInputElement;
              
              handleUpdateUser({
                name: form.value,
                phone: phone.value,
                role: role.value as any,
              });
            }}
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;