
import { Plan } from "@/types/plans";
import { CrudOperations } from "@/types/crud";
import { createCrudService } from "@/services/CrudService";
import { useStorageAdapterFactory } from "@/services/StorageAdapterFactory";

// Serviço específico para Planos que estende o CRUD genérico
export const usePlanService = (): CrudOperations<Plan> & {
  getActivePlans: () => Promise<Plan[]>;
  togglePlanStatus: (id: string, isActive: boolean) => Promise<Plan | null>;
  archivePlan: (id: string) => Promise<Plan | null>;
} => {
  const factory = useStorageAdapterFactory();
  const crudService = createCrudService<Plan>(factory, {
    type: 'supabase',
    config: { tableName: 'plans' }
  });

  // Métodos específicos para planos
  const getActivePlans = async (): Promise<Plan[]> => {
    try {
      const allPlans = await crudService.getAll();
      return allPlans.filter(plan => plan.is_active === true && plan.is_archived === false);
    } catch (error) {
      console.error('Erro ao buscar planos ativos:', error);
      return [];
    }
  };

  const togglePlanStatus = async (id: string, isActive: boolean): Promise<Plan | null> => {
    return crudService.update(id, { is_active: isActive });
  };

  const archivePlan = async (id: string): Promise<Plan | null> => {
    return crudService.update(id, { is_archived: true });
  };

  // Retorna a combinação do CRUD genérico com métodos específicos
  return {
    ...crudService,
    getActivePlans,
    togglePlanStatus,
    archivePlan
  };
};
