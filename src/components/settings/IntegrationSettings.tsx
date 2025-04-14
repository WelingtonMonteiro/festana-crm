
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHandleContext } from "@/contexts/handleContext";
import { MessageSquare, Facebook, Instagram } from "lucide-react";

const IntegrationSettings = () => {
  const { integrations, updateIntegration, apiUrl, setApiUrl } = useHandleContext();
  
  const getIntegrationIcon = (name: string) => {
    switch (name) {
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da API</CardTitle>
          <CardDescription>
            Configure a URL base da API para as integrações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="apiUrl">URL da API</Label>
              <div className="flex gap-2">
                <Input 
                  id="apiUrl" 
                  value={apiUrl} 
                  onChange={(e) => setApiUrl(e.target.value)} 
                  placeholder="https://sua-api.com"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integrações de Mensagens</CardTitle>
          <CardDescription>
            Habilite ou desabilite as integrações disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  {getIntegrationIcon(integration.name)}
                  <div>
                    <p className="font-medium capitalize">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {integration.enabled ? 'Habilitado' : 'Desabilitado'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={integration.enabled}
                  onCheckedChange={(checked) => updateIntegration(integration.id, { enabled: checked })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
