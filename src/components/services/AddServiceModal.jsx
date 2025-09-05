import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Server } from "@/api/entities";
import { 
  Server as ServerIcon, 
  Container, 
  Monitor, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockWindowsServices = [
  { name: 'IIS Admin Service', description: 'Internet Information Services admin', status: 'running', critical: true },
  { name: 'SQL Server', description: 'Microsoft SQL Server Database Engine', status: 'running', critical: true },
  { name: 'Windows Update', description: 'Windows automatic updates', status: 'stopped', critical: false },
  { name: 'Print Spooler', description: 'Manages print jobs', status: 'running', critical: false },
  { name: 'DHCP Client', description: 'Dynamic Host Configuration Protocol', status: 'running', critical: true },
  { name: 'DNS Client', description: 'Domain Name System resolver', status: 'running', critical: true },
  { name: 'Windows Firewall', description: 'Windows Defender Firewall service', status: 'running', critical: true },
];

const mockLinuxServices = [
  { name: 'nginx', description: 'High performance web server', status: 'running', critical: true },
  { name: 'sshd', description: 'OpenSSH server daemon', status: 'running', critical: true },
  { name: 'systemd', description: 'System and service manager', status: 'running', critical: true },
  { name: 'cron', description: 'Task scheduler daemon', status: 'running', critical: false },
  { name: 'rsyslog', description: 'System logging daemon', status: 'running', critical: false },
  { name: 'NetworkManager', description: 'Network connection manager', status: 'running', critical: true },
  { name: 'firewalld', description: 'Dynamic firewall daemon', status: 'running', critical: true },
];

const mockDockerServices = [
  { name: 'nginx-proxy', description: 'Nginx reverse proxy container', status: 'running', critical: true },
  { name: 'postgres-db', description: 'PostgreSQL database container', status: 'running', critical: true },
  { name: 'redis-cache', description: 'Redis caching container', status: 'running', critical: false },
  { name: 'portainer', description: 'Docker management UI', status: 'running', critical: false },
  { name: 'watchtower', description: 'Automatic container updater', status: 'running', critical: false },
  { name: 'grafana', description: 'Monitoring dashboard', status: 'stopped', critical: false },
];

export default function AddServiceModal({ isOpen, onClose, onAddServices }) {
  const [connectionMethod, setConnectionMethod] = useState('new'); // 'new' or 'existing'
  const [serverType, setServerType] = useState('linux');
  const [existingServers, setExistingServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  
  const [newServerData, setNewServerData] = useState({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    type: 'linux'
  });

  useEffect(() => {
    if (isOpen) {
      loadExistingServers();
      resetModal();
    }
  }, [isOpen]);

  const loadExistingServers = async () => {
    try {
      const servers = await Server.list();
      setExistingServers(servers);
    } catch (error) {
      console.error('Failed to load servers:', error);
    }
  };

  const resetModal = () => {
    setConnectionMethod('new');
    setServerType('linux');
    setSelectedServer(null);
    setIsConnecting(false);
    setIsConnected(false);
    setAvailableServices([]);
    setSelectedServices([]);
    setSelectAll(true);
    setNewServerData({
      name: '',
      host: '',
      port: '',
      username: '',
      password: '',
      type: 'linux'
    });
  };

  const getMockServices = (type) => {
    switch (type) {
      case 'windows':
        return mockWindowsServices;
      case 'linux':
        return mockLinuxServices;
      case 'docker':
        return mockDockerServices;
      default:
        return mockLinuxServices;
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let services = [];
    if (connectionMethod === 'new') {
      services = getMockServices(newServerData.type);
      toast.success(`Connected to ${newServerData.name || newServerData.host}`);
    } else if (selectedServer) {
      services = getMockServices(selectedServer.type);
      toast.success(`Connected to ${selectedServer.name}`);
    }
    
    setAvailableServices(services);
    setSelectedServices(selectAll ? services.map(s => s.name) : []);
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleServiceToggle = (serviceName, checked) => {
    setSelectedServices(prev => 
      checked 
        ? [...prev, serviceName]
        : prev.filter(s => s !== serviceName)
    );
  };

  const handleSelectAllToggle = (checked) => {
    setSelectAll(checked);
    setSelectedServices(checked ? availableServices.map(s => s.name) : []);
  };

  const handleAddServices = () => {
    const servicesToAdd = availableServices.filter(s => 
      selectedServices.includes(s.name)
    ).map(service => ({
      name: service.name,
      description: service.description,
      status: service.status,
      host: connectionMethod === 'new' ? (newServerData.name || newServerData.host) : selectedServer?.name,
      type: connectionMethod === 'new' ? newServerData.type : selectedServer?.type,
      alert: service.critical
    }));

    onAddServices(servicesToAdd);
    toast.success(`Added ${servicesToAdd.length} services to monitoring`);
    onClose();
  };

  const getServerIcon = (type) => {
    switch (type) {
      case 'windows':
        return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'linux':
        return <ServerIcon className="w-4 h-4 text-green-400" />;
      case 'docker':
        return <Container className="w-4 h-4 text-cyan-400" />;
      default:
        return <ServerIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      {!isConnected ? (
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting || (!newServerData.host && !selectedServer)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isConnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isConnecting ? 'Connecting...' : 'Connect & Scan'}
        </Button>
      ) : (
        <Button 
          onClick={handleAddServices}
          disabled={selectedServices.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Add {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''}
        </Button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Services to Monitor"
      description="Connect to a server and select which services to monitor"
      footer={footer}
      size="lg"
    >
      <div className="space-y-6">
        {!isConnected ? (
          <>
            <Tabs value={connectionMethod} onValueChange={setConnectionMethod}>
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger value="new">Connect New Server</TabsTrigger>
                <TabsTrigger value="existing">Use Existing Server</TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Server Type</Label>
                    <Select 
                      value={newServerData.type} 
                      onValueChange={(value) => setNewServerData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linux">
                          <div className="flex items-center gap-2">
                            <ServerIcon className="w-4 h-4 text-green-400" />
                            Linux Server
                          </div>
                        </SelectItem>
                        <SelectItem value="windows">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-blue-400" />
                            Windows Server
                          </div>
                        </SelectItem>
                        <SelectItem value="docker">
                          <div className="flex items-center gap-2">
                            <Container className="w-4 h-4 text-cyan-400" />
                            Docker Host
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Server Name</Label>
                    <Input
                      placeholder="My Server"
                      value={newServerData.name}
                      onChange={(e) => setNewServerData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Host/IP Address</Label>
                    <Input
                      placeholder="192.168.1.100"
                      value={newServerData.host}
                      onChange={(e) => setNewServerData(prev => ({ ...prev, host: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Port (optional)</Label>
                    <Input
                      placeholder="22 (SSH), 3389 (RDP), 2376 (Docker)"
                      value={newServerData.port}
                      onChange={(e) => setNewServerData(prev => ({ ...prev, port: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Username</Label>
                    <Input
                      placeholder="admin"
                      value={newServerData.username}
                      onChange={(e) => setNewServerData(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newServerData.password}
                      onChange={(e) => setNewServerData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="existing" className="space-y-4 mt-4">
                <div>
                  <Label className="text-gray-300">Select Existing Server</Label>
                  <Select value={selectedServer?.id || ''} onValueChange={(value) => {
                    const server = existingServers.find(s => s.id === value);
                    setSelectedServer(server);
                  }}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Choose a server..." />
                    </SelectTrigger>
                    <SelectContent>
                      {existingServers.map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          <div className="flex items-center gap-2">
                            {getServerIcon(server.type)}
                            <div>
                              <div className="font-medium">{server.name}</div>
                              <div className="text-xs text-gray-400">{server.host} • {server.type}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {existingServers.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2">No servers configured yet. Add servers in Settings or ESXi/Docker pages first.</p>
                  )}
                </div>

                {selectedServer && (
                  <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getServerIcon(selectedServer.type)}
                      <div>
                        <h3 className="font-semibold text-gray-100">{selectedServer.name}</h3>
                        <p className="text-sm text-gray-400">{selectedServer.host} • {selectedServer.type.toUpperCase()}</p>
                      </div>
                      <Badge className={selectedServer.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                        {selectedServer.status || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-emerald-400">Connection Successful</h3>
                <p className="text-sm text-gray-300">
                  Found {availableServices.length} services on {
                    connectionMethod === 'new' ? (newServerData.name || newServerData.host) : selectedServer?.name
                  }
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-gray-300 text-lg">Select Services to Monitor</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAllToggle}
                  />
                  <Label htmlFor="select-all" className="text-gray-400">Select All</Label>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {availableServices.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                  >
                    <Checkbox
                      id={service.name}
                      checked={selectedServices.includes(service.name)}
                      onCheckedChange={(checked) => handleServiceToggle(service.name, checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={service.name} className="font-medium text-gray-100 cursor-pointer">
                          {service.name}
                        </Label>
                        {service.critical && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">Critical</Badge>
                        )}
                        <Badge className={
                          service.status === 'running' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }>
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                    </div>
                    {selectedServices.includes(service.name) ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                  </motion.div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">
                    <strong>{selectedServices.length}</strong> service{selectedServices.length !== 1 ? 's' : ''} selected for monitoring
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}