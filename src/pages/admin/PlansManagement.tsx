import React, { useEffect, useState } from 'react';
import { Plan } from '@/types/plans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanList } from '@/components/admin/plans/PlanList';
import { PlanForm } from '@/components/admin/plans/PlanForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlanService } from '@/services/entityServices/planService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PricingSection } from '@/components/landing/PricingSection';

const PlansManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<Plan | null>(null);
  
  const planService = usePlanService();
  
  useEffect(() => {
    loadPlans();
  }, []);
  
  const loadPlans = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando planos com serviço:", planService);
      const plans = await planService.getAll();
      console.log("Planos carregados:", plans);
      setPlans(plans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Falha ao carregar planos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePlan = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const plan: Omit<Plan, 'id'> = {
        ...planData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log("Criando plano:", plan);
      const newPlan = await planService.create(plan);
      console.log("Plano criado:", newPlan);
      
      if (newPlan) {
        toast.success('Plano criado com sucesso');
        setIsCreating(false);
        loadPlans();
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Falha ao criar plano');
    }
  };
  
  const handleUpdatePlan = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingPlan || !editingPlan.id) {
      console.error('ID do plano não disponível para atualização');
      toast.error('Falha ao identificar o plano para atualização');
      return;
    }
    
    try {
      const plan: Partial<Plan> = {
        ...planData,
        updated_at: new Date().toISOString(),
      };
      
      console.log("Atualizando plano:", editingPlan.id, plan);
      const updatedPlan = await planService.update(editingPlan.id, plan);
      console.log("Plano atualizado:", updatedPlan);
      
      if (updatedPlan) {
        toast.success('Plano atualizado com sucesso');
        setEditingPlan(null);
        loadPlans();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Falha ao atualizar plano');
    }
  };
  
  const handleTogglePlanStatus = async (id: string, isActive: boolean) => {
    if (!id) {
      console.error('ID do plano não fornecido para alteração de status');
      toast.error('Falha ao identificar o plano');
      return;
    }
    
    try {
      console.log("Alterando status do plano:", id, isActive);
      const result = await planService.togglePlanStatus(id, isActive);
      console.log("Status do plano alterado:", result);
      
      if (result) {
        toast.success(`Plano ${isActive ? 'ativado' : 'desativado'} com sucesso`);
        loadPlans();
      }
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast.error(`Falha ao ${isActive ? 'ativar' : 'desativar'} plano`);
    }
  };
  
  const handleArchivePlan = async (id: string) => {
    if (!id) {
      console.error('ID do plano não fornecido para arquivamento');
      toast.error('Falha ao identificar o plano');
      return;
    }
    
    try {
      console.log("Arquivando plano:", id);
      const result = await planService.archivePlan(id);
      console.log("Plano arquivado:", result);
      
      if (result) {
        toast.success('Plano arquivado com sucesso');
        loadPlans();
      }
    } catch (error) {
      console.error('Error archiving plan:', error);
      toast.error('Falha ao arquivar plano');
    }
  };
  
  const handleEditPlan = (plan: Plan) => {
    if (!plan || !plan.id) {
      console.error('Plano inválido para edição');
      toast.error('Falha ao preparar plano para edição');
      return;
    }
    setEditingPlan(plan);
    setIsCreating(false);
  };
  
  const handleCancelEdit = () => {
    setEditingPlan(null);
    setIsCreating(false);
  };
  
  const handleStartCreating = () => {
    setIsCreating(true);
    setEditingPlan(null);
  };
  
  const handlePreviewPlan = (plan: Plan) => {
    setPreviewPlan(plan);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Planos</h1>
        {!isCreating && !editingPlan && (
          <Button onClick={handleStartCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {!isCreating && !editingPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Planos Disponíveis</CardTitle>
              <CardDescription>
                Gerencie os planos de assinatura disponíveis para os clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanList 
                plans={plans} 
                isLoading={isLoading}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
                onArchive={handleArchivePlan}
                onPreview={handlePreviewPlan}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                showArchived={showArchived}
                onShowArchivedChange={setShowArchived}
              />
            </CardContent>
          </Card>
        )}
        
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Plano</CardTitle>
              <CardDescription>
                Preencha os detalhes para criar um novo plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm 
                plan={null}
                onSubmit={handleCreatePlan}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        )}
        
        {editingPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Plano</CardTitle>
              <CardDescription>
                Atualize as informações do plano selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm 
                plan={editingPlan}
                onSubmit={handleUpdatePlan}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!previewPlan} onOpenChange={() => setPreviewPlan(null)}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Preview do Plano</CardTitle>
            <CardDescription>
              Visualização do plano como será exibido na página inicial
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewPlan && (
              <div className="bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card 
                    className={`w-full ${previewPlan.is_popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
                  >
                    {previewPlan.is_popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md rounded-tr-md">
                        Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{previewPlan.name}</CardTitle>
                      <CardDescription>{previewPlan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          R$ {previewPlan.price_monthly.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground ml-2">/mês</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(typeof previewPlan.features === 'string' 
                          ? previewPlan.features.split(',') 
                          : previewPlan.features
                        ).map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <span>• {feature.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManagement;
