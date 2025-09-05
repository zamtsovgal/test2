import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderIcon } from '../shared/ProviderIcons';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Key, Server, User, Lock, Wifi } from 'lucide-react';
import { toast } from "sonner";

export default function ProviderSettingsModal({ isOpen, onClose, provider, onSave }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (provider) {
      // Initialize form with placeholder or actual data
      const initialConfig = provider.type === 'local' 
        ? { host: provider.description || '127.0.0.1', port: '587', username: '', password: '' }
        : { apiKey: '••••••••••••••••••••' };
      setConfig(initialConfig);
    }
  }, [provider]);

  if (!provider) return null;

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success(`Settings for ${provider.name} saved.`);
    onSave({ ...provider, ...config }); // Pass updated provider data back
    onClose();
  };

  const handleTestConnection = () => {
    toast.info(`Testing connection for ${provider.name}...`);
    setTimeout(() => {
        // Simulate a random success or failure
        if (Math.random() > 0.3) {
            toast.success("Connection successful!");
        } else {
            toast.error("Connection failed: Authentication error.");
        }
    }, 1500);
  }

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button variant="secondary" onClick={handleTestConnection}><Wifi className="w-4 h-4 mr-2"/>Test Connection</Button>
      <Button onClick={handleSave}>Save Changes</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure: ${provider.name}`}
      footer={footer}
    >
        <div className="flex items-center gap-4 mb-6">
            <ProviderIcon name={provider.icon} className="h-12 w-12" />
            <div>
                <h3 className="text-lg font-semibold text-gray-100">{provider.name}</h3>
                <p className="text-sm text-gray-400">{provider.description}</p>
            </div>
        </div>

        {provider.status === 'error' && (
             <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{provider.error || "Failed to connect to provider. Please check your settings."}</AlertDescription>
            </Alert>
        )}

        <div className="space-y-4">
            {provider.type === 'cloud' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="apiKey"><Key className="w-3 h-3 inline-block mr-2"/>API Key</Label>
                        <Input id="apiKey" type="password" value={config.apiKey} onChange={(e) => handleChange('apiKey', e.target.value)} className="bg-gray-700" />
                    </div>
                </>
            )}
            {provider.type === 'local' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="host"><Server className="w-3 h-3 inline-block mr-2"/>Host</Label>
                        <Input id="host" value={config.host} onChange={(e) => handleChange('host', e.target.value)} className="bg-gray-700" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="port">Port</Label>
                        <Input id="port" type="number" value={config.port} onChange={(e) => handleChange('port', e.target.value)} className="bg-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username"><User className="w-3 h-3 inline-block mr-2"/>Username</Label>
                        <Input id="username" value={config.username} onChange={(e) => handleChange('username', e.target.value)} className="bg-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password"><Lock className="w-3 h-3 inline-block mr-2"/>Password</Label>
                        <Input id="password" type="password" value={config.password} onChange={(e) => handleChange('password', e.target.value)} className="bg-gray-700" />
                    </div>
                </>
            )}
        </div>
    </Modal>
  );
}