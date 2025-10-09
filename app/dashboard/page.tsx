'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Plus, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppointmentStore, useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { appointments, setAppointments } = useAppointmentStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    loadAppointments()
  }, [])

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
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date()
  const currentMonth = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: monthEnd })

  // Estatísticas
  const todayAppointments = appointments.filter(apt => 
    isSameDay(parseISO(apt.start_time), today)
  )
  const thisMonthAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.start_time)
    return aptDate >= currentMonth && aptDate <= monthEnd
  })
  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

  const recentAppointments = appointments
    .filter(apt => new Date(apt.start_time) >= today)
    .slice(0, 5)

  const stats = [
    {
      title: 'Hoje',
      value: todayAppointments.length,
      icon: CalendarIcon,
      description: 'Agendamentos hoje',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Este Mês',
      value: thisMonthAppointments.length,
      icon: TrendingUp,
      description: 'Total no mês',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Concluídos',
      value: completedAppointments.length,
      icon: Users,
      description: 'Agendamentos finalizados',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-slate-600">
          Aqui está um resumo dos seus agendamentos
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Calendário</CardTitle>
                <CardDescription>
                  {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                </CardDescription>
              </div>
              <Link href="/dashboard/appointments/new">
                <Button variant="gradient" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-sm font-medium text-slate-600 py-2">
                    {day}
                  </div>
                ))}
                {daysInMonth.map((day) => {
                  const hasAppointments = appointments.some(apt =>
                    isSameDay(parseISO(apt.start_time), day)
                  )
                  const isToday = isSameDay(day, today)
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 rounded-lg text-sm transition-all duration-200
                        hover:bg-blue-50 hover:scale-105
                        ${isToday ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold' : ''}
                        ${hasAppointments && !isToday ? 'bg-blue-100 font-medium' : ''}
                      `}
                    >
                      {format(day, 'd')}
                      {hasAppointments && (
                        <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                          isToday ? 'bg-white' : 'bg-blue-600'
                        }`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Seus compromissos futuros</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentAppointments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum agendamento próximo</p>
                  <Link href="/dashboard/appointments/new">
                    <Button variant="link" size="sm" className="mt-2">
                      Criar primeiro agendamento
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/dashboard/appointments/${appointment.id}`}>
                        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{appointment.title}</h4>
                                <p className="text-sm text-slate-600">{appointment.client_name}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  {format(parseISO(appointment.start_time), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                </div>
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
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
