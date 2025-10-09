'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Calendar, Clock, User, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppointmentStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function AppointmentsPage() {
  const { appointments, setAppointments, deleteAppointment } = useAppointmentStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  })

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('start_time', { ascending: true })

        if (error) throw error

        if (data) {
          setAppointments(data)
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
        toast.error('Erro ao carregar agendamentos')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAppointments()
  }, [])

  const handleDelete = async () => {
    if (!deleteDialog.id) return

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', deleteDialog.id)

      if (error) throw error

      deleteAppointment(deleteDialog.id)
      toast.success('Agendamento deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast.error('Erro ao deletar agendamento')
    } finally {
      setDeleteDialog({ open: false, id: null })
    }
  }

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Agendamentos</h1>
          <p className="text-slate-600">
            Gerencie todos os seus compromissos em um só lugar
          </p>
        </div>
        <Link href="/dashboard/appointments/new">
          <Button variant="gradient" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por título, cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-medium mb-2">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum agendamento ainda'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm
                  ? 'Tente ajustar sua busca'
                  : 'Comece criando seu primeiro agendamento'}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/appointments/new">
                  <Button variant="gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Agendamento
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{appointment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {appointment.service}
                      </CardDescription>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Agendado' :
                       appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{appointment.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(parseISO(appointment.start_time), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(parseISO(appointment.start_time), 'HH:mm')} - {format(parseISO(appointment.end_time), 'HH:mm')}
                      {' '}({appointment.duration} min)
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link href={`/dashboard/appointments/${appointment.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteDialog({ open: true, id: appointment.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
