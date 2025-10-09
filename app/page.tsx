'use client'

import { motion } from 'framer-motion'
import { Check, User, Clock, Users, Sparkles, CreditCard, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'

const plans = [
  {
    name: 'Mensal',
    price: 79.90,
    period: 'mês',
    description: 'Perfeito para começar',
    features: [
      'Agendamentos ilimitados',
      'Calendário interativo',
      'Notificações por email',
      'Suporte por email',
      'Relatórios básicos',
    ],
    highlight: false,
  },
  {
    name: 'Trimestral',
    price: 169.90,
    period: '3 meses',
    description: 'Melhor custo-benefício',
    features: [
      'Tudo do plano Mensal',
      'Lembretes automáticos SMS',
      'Integração WhatsApp',
      'Suporte prioritário',
      'Relatórios avançados',
      'Personalização de cores',
    ],
    highlight: false,
  },
  {
    name: 'Anual',
    price: 719.90,
    period: 'ano',
    description: 'Máximo economia e recursos',
    features: [
      'Tudo do plano Trimestral',
      'Multi-usuários (até 5)',
      'API de integração',
      'Suporte 24/7 prioritário',
      'Dashboard personalizado',
      'Exportação de dados',
      'Backup automático',
    ],
    highlight: true,
    installments: 'ou 10x de R$ 71,99 no cartão',
  },
]

const benefits = [
  {
    icon: Calendar,
    title: 'Calendário Inteligente',
    description: 'Visualize todos seus agendamentos em um calendário interativo e intuitivo',
  },
  {
    icon: Clock,
    title: 'Gestão de Tempo',
    description: 'Otimize seu tempo com lembretes automáticos e detecção de conflitos',
  },
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Mantenha histórico completo de todos os seus clientes e serviços',
  },
  {
    icon: Sparkles,
    title: 'Interface Moderna',
    description: 'Design limpo e intuitivo que facilita o uso no dia a dia',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Logo size="lg" href="/" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login">
              <Button variant="gradient">
                Entrar
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sistema de Agendamentos
            <br />
            Moderno e Inteligente
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Gerencie seus compromissos de forma simples e eficiente. 
            Interface intuitiva, recursos poderosos.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="gradient" className="text-lg" asChild>
              <a href="#pricing">Ver Planos</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link href="/login">Começar Agora</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Por que escolher o TIMEO?</h2>
          <p className="text-slate-600 text-lg">Recursos que fazem a diferença no seu dia a dia</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Escolha seu Plano</h2>
          <p className="text-slate-600 text-lg">Planos flexíveis para cada necessidade</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={plan.highlight ? 'md:scale-110 z-10' : ''}
            >
              <Card className={`h-full relative ${
                plan.highlight 
                  ? 'border-2 border-purple-500 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50' 
                  : ''
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-slate-600 ml-2">/{plan.period}</span>
                  </div>
                  {plan.installments && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600 font-medium">
                      <CreditCard className="w-4 h-4" />
                      {plan.installments}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={plan.highlight ? "gradient" : "outline"} 
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/login">
                      Começar Agora
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Pronto para começar?
              </CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Junte-se a centenas de profissionais que já otimizaram sua gestão de tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/login">
                  Criar Conta Grátis
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>&copy; 2025 TIMEO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
