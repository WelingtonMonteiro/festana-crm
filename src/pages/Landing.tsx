
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, Layout, MessageSquare, Settings, Smartphone, Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginHeader from '@/components/landing/LoginHeader';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate credentials
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Gestão de Eventos",
      description: "Agende e gerencie todos os seus eventos em um só lugar com nosso calendário intuitivo."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Gestão de Clientes",
      description: "Acompanhe todos os seus clientes, suas preferências e histórico."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Mensagens",
      description: "Comunique-se com os clientes diretamente através do nosso sistema integrado de mensagens."
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: "Temas Personalizados",
      description: "Escolha entre uma variedade de temas e kits para os seus eventos."
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: "Relatórios e Análises",
      description: "Obtenha insights detalhados sobre o desempenho do seu negócio."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Acesso Mobile",
      description: "Acesse seu planejador de eventos em qualquer dispositivo, a qualquer hora, em qualquer lugar."
    }
  ];

  const testimonials = [
    {
      quote: "Este sistema de planejamento de eventos transformou a maneira como gerencio meu negócio. Agora posso lidar com o dobro de eventos com metade do estresse.",
      author: "Sarah Johnson, Planejadora de Eventos"
    },
    {
      quote: "Os recursos de gerenciamento de clientes por si só já valem o investimento. Meus clientes adoram como os eventos deles estão organizados agora.",
      author: "Miguel Rodriguez, Coordenador de Festas"
    },
    {
      quote: "Eu costumava gastar horas em tarefas administrativas. Agora posso me concentrar no que importa - criar eventos incríveis para meus clientes.",
      author: "Ana Chen, Planejadora de Casamentos"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com opção de login */}
      <LoginHeader onLoginClick={() => setLoginModalOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-festa-primary/10 via-background to-festa-secondary/10 py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplifique seu <span className="bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text">Negócio de Eventos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A plataforma completa para organizadores de eventos gerenciarem clientes, eventos, inventário e finanças em um só lugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setLoginModalOpen(true)}
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[400px] w-full rounded-lg overflow-hidden shadow-xl border">
            <img 
              src="/placeholder.svg" 
              alt="Prévia do Dashboard" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="text-sm font-medium">Visão Geral do Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo o que Você Precisa para Gerenciar seu Negócio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma fornece todas as ferramentas necessárias para gerenciar eventos com eficiência e expandir seu negócio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja Nossa Plataforma em Ação</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Confira algumas das principais características e interfaces do nosso sistema de planejamento de eventos.
            </p>
          </div>
          
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Visualização de Calendário" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Gerenciamento de Calendário</h3>
                      <p className="text-muted-foreground">Visualize e gerencie todos os seus eventos em uma interface intuitiva de calendário.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Dashboard de Clientes" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Dashboard de Clientes</h3>
                      <p className="text-muted-foreground">Acompanhe todas as informações dos clientes, preferências e histórico.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Seleção de Temas" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Seleção de Temas</h3>
                      <p className="text-muted-foreground">Navegue e selecione entre múltiplos temas e kits para festas.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Escolher Nossa Plataforma?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja por que organizadores de eventos confiam em nosso sistema para gerenciar seus negócios.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Economia de Tempo</h3>
                <p className="text-muted-foreground">Economize até 15 horas por semana em tarefas administrativas e coordenação de eventos.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Aumento de Receita</h3>
                <p className="text-muted-foreground">Em média, nossos usuários relatam um aumento de 30% na capacidade de negócios e receita.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Satisfação do Cliente</h3>
                <p className="text-muted-foreground">Melhor organização leva a clientes mais satisfeitos e mais indicações.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Solução Completa</h3>
                <p className="text-muted-foreground">Todas as suas ferramentas em um só lugar, em vez de lidar com vários sistemas de software.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Segurança de Dados</h3>
                <p className="text-muted-foreground">Seus dados de negócios e de clientes são armazenados e backupeados de forma segura.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Sempre Disponível</h3>
                <p className="text-muted-foreground">Acesse seu sistema de gerenciamento de eventos 24/7 de qualquer dispositivo, em qualquer lugar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não acredite apenas em nossa palavra. Veja o que organizadores de eventos profissionais dizem sobre nossa plataforma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
                      <path d="M13.5 18H9C9.33333 12 12.4 9 18.2 9V13.5C15.6 13.5 13.6667 15 13.5 18ZM31.5 18H27C27.3333 12 30.4 9 36.2 9V13.5C33.6 13.5 31.6667 15 31.5 18Z" fill="currentColor"/>
                      <path d="M13.5 18H9V27H18V18H13.5ZM31.5 18H27V27H36V18H31.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="mb-4 italic">{testimonial.quote}</p>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Festa Planner</h3>
              <p className="text-muted-foreground mt-2">A solução completa para gerenciamento de eventos</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-medium mb-3">Produto</h4>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Recursos</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Preços</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">FAQ</Button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Empresa</h4>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Sobre</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Contato</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Privacidade</Button></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 Festa Planner. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Login */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Entrar na sua conta</DialogTitle>
            <DialogDescription>
              Digite suas credenciais para acessar o sistema de planejamento de eventos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="nome@exemplo.com"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Button type="button" variant="link" className="p-0 h-auto text-xs">
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Entre em contato
                </Button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
