'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, Clock, User, Briefcase } from 'lucide-react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addMinutes, parseISO } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppointmentStore, useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

const appointmentSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  client_name: z.string().min(2, 'Nome do cliente é obrigatório'),
  service: z.string().min(1, 'Selecione um serviço'),
  duration: z.number().min(15, 'Duração mínima de 15 minutos'),
})

type AppointmentForm = z.infer<typeof appointmentSchema>

const services = [
  'Consulta',
  'Reunião',
  'Avaliação',
  'Acompanhamento',
  'Sessão',
  'Workshop',
  'Treinamento',
  'Outro',
]

const durations = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h 30min' },
  { value: 120, label: '2 horas' },
]

export default function NewAppointmentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())
  const router = useRouter()
  const { user } = useAuthStore()
  const { addAppointment, appointments } = useAppointmentStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
    },
  })

  const duration = watch('duration')

  const onSubmit = async (data: AppointmentForm) => {
    setIsLoading(true)

    try {
      // Combinar data e hora
      const startDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      )

      const endDateTime = addMinutes(startDateTime, data.duration)

      // Verificar conflitos de horário
      const hasConflict = appointments.some((apt) => {
        const aptStart = parseISO(apt.start_time)
        const aptEnd = parseISO(apt.end_time)
        return (
          (startDateTime >= aptStart && startDateTime < aptEnd) ||
          (endDateTime > aptStart && endDateTime <= aptEnd) ||
          (startDateTime <= aptStart && endDateTime >= aptEnd)
        )
      })

      if (hasConflict) {
        toast.error('Já existe um agendamento neste horário!')
        setIsLoading(false)
        return
      }

      // Criar agendamento no Supabase
      const newAppointment = {
        user_id: user?.id,
        title: data.title,
        client_name: data.client_name,
        service: data.service,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration: data.duration,
        status: 'scheduled' as const,
      }

      const { data: createdAppointment, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select()
        .single()

      if (error) throw error

      addAppointment(createdAppointment)
      toast.success('Agendamento criado com sucesso!')
      router.push('/dashboard/appointments')
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error)
      toast.error(error.message || 'Erro ao criar agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Novo Agendamento</h1>
        <p className="text-slate-600">
          Preencha os dados para criar um novo compromisso
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações do Agendamento</CardTitle>
            <CardDescription>
              Todos os campos são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Título do Agendamento
                  </div>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Consulta inicial com João"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Nome do Cliente */}
              <div className="space-y-2">
                <Label htmlFor="client_name">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome do Cliente
                  </div>
                </Label>
                <Input
                  id="client_name"
                  placeholder="Nome completo do cliente"
                  {...register('client_name')}
                />
                {errors.client_name && (
                  <p className="text-sm text-red-500">{errors.client_name.message}</p>
                )}
              </div>

              {/* Serviço */}
              <div className="space-y-2">
                <Label htmlFor="service">Tipo de Serviço</Label>
                <Select onValueChange={(value) => setValue('service', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-sm text-red-500">{errors.service.message}</p>
                )}
              </div>

              {/* Data e Hora */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Data
                    </div>
                  </Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Horário
                    </div>
                  </Label>
                  <DatePicker
                    selected={selectedTime}
                    onChange={(date) => date && setSelectedTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Horário"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              </div>

              {/* Duração */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Select
                  defaultValue="30"
                  onValueChange={(value) => setValue('duration', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur.value} value={dur.value.toString()}>
                        {dur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Criar Agendamento'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
