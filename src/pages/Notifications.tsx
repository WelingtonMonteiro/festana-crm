
import { useState, useEffect } from 'react';
import { useHandleContext } from '@/contexts/handleContext.tsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'event' | 'message' | 'system';
  eventId?: string;
  messageId?: string;
};

const Notifications = () => {
  const { events, messages } = useHandleContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Generate notifications based on events and messages
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // Check for upcoming events (in the next 3 days)
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    // Verificar se events existe e filtrar eventos válidos
    const upcomingEvents = events?.filter(event => {
      if (!event || !event.data) return false;
      
      const eventDate = new Date(event.data);
      return eventDate >= today && eventDate <= threeDaysLater && event.status !== 'cancelado';
    }) || [];
    
    upcomingEvents.forEach(event => {
      // Verificar se o cliente existe antes de acessar a propriedade nome
      const clientName = event.cliente && event.cliente.nome ? event.cliente.nome : 'Cliente não definido';
      
      newNotifications.push({
        id: `event-${event.id}`,
        title: 'Upcoming Event',
        message: `${clientName} - ${format(new Date(event.data), 'dd/MM/yyyy')}`,
        date: new Date().toISOString(),
        read: false,
        type: 'event',
        eventId: event.id
      });
    });
    
    // Verificar se messages existe e filtrar mensagens não lidas
    const unreadMessages = messages?.filter(m => !m.lida && m.remetente === 'cliente') || [];
    unreadMessages.forEach(message => {
      newNotifications.push({
        id: `message-${message.id}`,
        title: 'Unread Message',
        message: message.conteudo,
        date: message.datahora,
        read: false,
        type: 'message',
        messageId: message.id
      });
    });
    
    // Retrieve notifications from localStorage if they exist
    const storedNotifications = localStorage.getItem('notifications');
    const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    // Combine existing notifications with new ones
    const allNotifications = [...existingNotifications, ...newNotifications];
    
    // Remove duplicates (based on ID)
    const uniqueNotifications = Array.from(
      new Map(allNotifications.map(item => [item.id, item])).values()
    );
    
    // Sort by date (most recent first)
    uniqueNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setNotifications(uniqueNotifications);
    localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
  }, [events, messages]);
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'read') return notification.read;
    if (filter === 'unread') return !notification.read;
    return true;
  });
  
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };
  
  const openDetails = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          Manage all your notifications in one place
        </p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
        
        <TabsContent value="read" className="mt-0">
          {renderNotifications(filteredNotifications, openDetails)}
        </TabsContent>
      </Tabs>
      
      {/* Notification details modal - modified to show full content */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {selectedNotification && format(new Date(selectedNotification.date), 
                "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
              }
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-0">
            <p className="text-base">{selectedNotification?.message}</p>
            
            {selectedNotification?.type === 'event' && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This notification is related to an upcoming event.
                </p>
                <Button 
                  className="mt-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    window.location.href = `/events?id=${selectedNotification.eventId}`;
                  }}
                >
                  View Event
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to render the notification list
const renderNotifications = (
  notifications: Notification[], 
  openDetails: (notification: Notification) => void
) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No notifications found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`p-4 rounded-lg border cursor-pointer transition-colors
            ${notification.read 
              ? 'bg-background hover:bg-accent/50' 
              : 'bg-accent/20 hover:bg-accent/30 font-medium'
            }`}
          onClick={() => openDetails(notification)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(notification.date), 'dd/MM/yyyy')}
              </span>
              {!notification.read && (
                <Badge variant="secondary" className="bg-festa-secondary text-white">New</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
