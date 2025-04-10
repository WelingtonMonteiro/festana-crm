
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFestaContext } from '@/contexts/FestaContext';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarPlus, Clock, MapPin } from 'lucide-react';

const CalendarioPage = () => {
  const { clientes, temas, kits, eventos, adicionarEvento } = useFestaContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    clienteId: '',
    temaId: '',
    kitId: '',
    horario: '',
    local: '',
    trajeto: '',
    valorTotal: '',
    valorSinal: '',
    valorRestante: '',
    observacoes: ''
  });
  
  // Encontrar eventos do dia selecionado
  const eventosDoDia = selectedDay 
    ? eventos.filter(evento => isSameDay(new Date(evento.data), selectedDay))
    : [];
  
  // Handler para clicar em um dia
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      setSelectedDay(day);
    }
  };
  
  // Handler para mudança nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calcular valor restante automaticamente
    if (name === 'valorTotal' || name === 'valorSinal') {
      const valorTotal = name === 'valorTotal' ? parseFloat(value) || 0 : parseFloat(formData.valorTotal) || 0;
      const valorSinal = name === 'valorSinal' ? parseFloat(value) || 0 : parseFloat(formData.valorSinal) || 0;
      const valorRestante = valorTotal - valorSinal;
      setFormData(prev => ({
        ...prev,
        valorRestante: valorRestante.toString()
      }));
    }
  };
  
  // Handler para mudança nos selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Se o kit mudar, atualiza o valor total
    if (name === 'kitId') {
      const kit = kits.find(k => k.id === value);
      if (kit) {
        const valorTotal = kit.preco;
        const valorSinal = valorTotal / 2; // 50% de sinal por padrão
        const valorRestante = valorTotal - valorSinal;
        
        setFormData(prev => ({
          ...prev,
          valorTotal: valorTotal.toString(),
          valorSinal: valorSinal.toString(),
          valorRestante: valorRestante.toString()
        }));
      }
    }
  };
  
  // Handler para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDay) return;
    
    const cliente = clientes.find(c => c.id === formData.clienteId);
    const tema = formData.temaId ? temas.find(t => t.id === formData.temaId) : undefined;
    const kit = kits.find(k => k.id === formData.kitId);
    
    if (!cliente || !kit) return;
    
    adicionarEvento({
      cliente,
      tema,
      kit,
      data: format(selectedDay, 'yyyy-MM-dd'),
      horario: formData.horario,
      local: formData.local,
      trajeto: formData.trajeto,
      valorTotal: parseFloat(formData.valorTotal),
      valorSinal: parseFloat(formData.valorSinal),
      valorRestante: parseFloat(formData.valorRestante),
      status: 'agendado',
      observacoes: formData.observacoes
    });
    
    setDialogOpen(false);
    resetForm();
  };
  
  // Resetar formulário
  const resetForm = () => {
    setFormData({
      clienteId: '',
      temaId: '',
      kitId: '',
      horario: '',
      local: '',
      trajeto: '',
      valorTotal: '',
      valorSinal: '',
      valorRestante: '',
      observacoes: ''
    });
  };
  
  // Renderizar decorador do dia no calendário
  const dayWithEvents = (day: Date) => {
    const matchingEvents = eventos.filter(evento => 
      isSameDay(new Date(evento.data), day)
    );
    
    if (matchingEvents.length > 0) {
      return (
        <div className="relative h-full w-full p-2">
          <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-festa-primary" />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendário de Eventos</h1>
        <Button 
          onClick={() => {
            setSelectedDay(new Date());
            setDialogOpen(true);
          }}
          className="bg-festa-primary hover:bg-festa-primary/90"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendário de Eventos</CardTitle>
            <CardDescription>Visualize e gerencie seus eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              onDayClick={handleDayClick}
              locale={ptBR}
              className="rounded-md border"
              components={{
                DayContent: props => (
                  <div className="relative h-9 w-9 p-0" {...props}>
                    <div className="flex h-full w-full items-center justify-center">
                      {props.day.day}
                    </div>
                    {dayWithEvents(props.day.date)}
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>
        
        {/* Eventos do dia selecionado */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDay ? `Eventos de ${format(selectedDay, 'dd/MM/yyyy')}` : 'Eventos'}
            </CardTitle>
            <CardDescription>
              {selectedDay ? `${eventosDoDia.length} eventos para este dia` : 'Selecione um dia para ver os eventos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDay && (
              <div className="space-y-4">
                {eventosDoDia.length > 0 ? (
                  eventosDoDia.map(evento => (
                    <div key={evento.id} className="rounded-lg border p-4 hover:bg-muted/50">
                      <div className="flex justify-between">
                        <div className="font-medium">{evento.cliente.nome}</div>
                        <div className="text-sm text-muted-foreground">{evento.status}</div>
                      </div>
                      <div className="mt-1 text-sm">{evento.tema?.nome} - {evento.kit.nome}</div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" /> {evento.horario}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" /> {evento.local}
                      </div>
                      <div className="mt-3 flex justify-between text-sm">
                        <div>Valor: R$ {evento.valorTotal.toLocaleString('pt-BR')}</div>
                        <div>Sinal: R$ {evento.valorSinal.toLocaleString('pt-BR')}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">Nenhum evento para este dia</p>
                    <Button 
                      variant="link" 
                      onClick={() => setDialogOpen(true)}
                      className="mt-2"
                    >
                      Agendar novo evento
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog para adicionar evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Agendar Novo Evento</DialogTitle>
            <DialogDescription>
              Preencha os dados para agendar um novo evento.
              {selectedDay && ` Data selecionada: ${format(selectedDay, 'dd/MM/yyyy')}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('clienteId', value)} 
                  value={formData.clienteId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tema">Tema (opcional)</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('temaId', value)} 
                  value={formData.temaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {temas.map(tema => (
                      <SelectItem key={tema.id} value={tema.id}>
                        {tema.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kit">Kit</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('kitId', value)} 
                  value={formData.kitId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um kit" />
                  </SelectTrigger>
                  <SelectContent>
                    {kits.map(kit => (
                      <SelectItem key={kit.id} value={kit.id}>
                        {kit.nome} - R$ {kit.preco.toLocaleString('pt-BR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horario">Horário</Label>
                <Input 
                  id="horario" 
                  name="horario" 
                  type="time" 
                  value={formData.horario} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="local">Local</Label>
                <Input 
                  id="local" 
                  name="local" 
                  value={formData.local} 
                  onChange={handleChange}
                  placeholder="Endereço do evento"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="trajeto">Trajeto (opcional)</Label>
                <Input 
                  id="trajeto" 
                  name="trajeto" 
                  value={formData.trajeto} 
                  onChange={handleChange}
                  placeholder="URL do Google Maps ou descrição do trajeto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input 
                  id="valorTotal" 
                  name="valorTotal" 
                  type="number" 
                  value={formData.valorTotal} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorSinal">Valor do Sinal (R$)</Label>
                <Input 
                  id="valorSinal" 
                  name="valorSinal" 
                  type="number" 
                  value={formData.valorSinal} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorRestante">Valor Restante (R$)</Label>
                <Input 
                  id="valorRestante" 
                  name="valorRestante" 
                  type="number" 
                  value={formData.valorRestante} 
                  onChange={handleChange}
                  disabled
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input 
                  id="observacoes" 
                  name="observacoes" 
                  value={formData.observacoes} 
                  onChange={handleChange}
                  placeholder="Observações sobre o evento"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-festa-primary hover:bg-festa-primary/90">
                Agendar Evento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioPage;
