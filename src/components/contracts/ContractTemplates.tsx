
import { useState } from 'react';
import { useHandleContext } from '@/contexts/handleContext';
import { ContractTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, Edit, Copy, Trash, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import ContractEditor from './ContractEditor';

interface ContractTemplatesProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
}

const ContractTemplates = ({ selectedTemplate, setSelectedTemplate }: ContractTemplatesProps) => {
  const { contractTemplates, addContractTemplate, updateContractTemplate, removeContractTemplate } = useHandleContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToEdit, setTemplateToEdit] = useState<ContractTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('O nome do modelo não pode estar vazio');
      return;
    }

    const newTemplate = addContractTemplate({
      name: newTemplateName.trim(),
      content: `<h1>${newTemplateName}</h1><p>Insira aqui o conteúdo do contrato.</p>`
    });

    if (newTemplate) {
      setNewTemplateName('');
      setIsCreateDialogOpen(false);
      setSelectedTemplate(newTemplate.id);
      setIsEditDialogOpen(true);
      setTemplateToEdit(newTemplate);
    }
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setTemplateToEdit(template);
    setSelectedTemplate(template.id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      removeContractTemplate(templateToDelete);
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);

      if (selectedTemplate === templateToDelete) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleCopyTemplate = (template: ContractTemplate) => {
    const copiedTemplate = addContractTemplate({
      name: `${template.name} (Cópia)`,
      content: template.content
    });

    if (copiedTemplate) {
      toast.success(`Modelo "${template.name}" copiado com sucesso`);
    }
  };

  const filteredTemplates = contractTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos de contrato..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Modelo
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center p-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum modelo encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie um novo modelo de contrato para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium truncate">{template.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyTemplate(template)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setTemplateToDelete(template.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 h-12" 
                  dangerouslySetInnerHTML={{ 
                    __html: template.content.replace(/<[^>]*>?/gm, ' ').substring(0, 100) + '...' 
                  }} 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Criado em: {format(new Date(template.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <Edit className="mr-2 h-3 w-3" /> Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Modelo de Contrato</DialogTitle>
            <DialogDescription>
              Crie um novo modelo de contrato para usar com seus clientes.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nome do modelo de contrato"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTemplate}>Criar Modelo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Modelo de Contrato</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este modelo de contrato? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      {templateToEdit && (
        <ContractEditor
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          template={templateToEdit}
          onSave={(content) => {
            updateContractTemplate(templateToEdit.id, { content });
            setIsEditDialogOpen(false);
            setTemplateToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ContractTemplates;
