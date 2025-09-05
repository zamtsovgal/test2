import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, AreaChart, Area } from "recharts";
import { Cpu, MemoryStick, HardDrive, Wifi, Server, Container, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Generate mock data for different services
const generateServiceData = (serviceName) => {
    const data = [];
    for (let i = 48; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        
        // Different baseline values for different services
        const baselines = {
            'ESXi-HOST-01': { cpu: 45, memory: 65, network: 30 },
            'ESXi-HOST-02': { cpu: 35, memory: 55, network: 25 },
            'Docker-Host-01': { cpu: 25, memory: 45, network: 40 },
            'NAS-Storage': { cpu: 15, memory: 30, network: 80 },
            'Web-Server-VM': { cpu: 60, memory: 70, network: 45 },
            'DB-Server-VM': { cpu: 40, memory: 85, network: 20 },
            'nginx-container': { cpu: 5, memory: 15, network: 60 },
            'postgres-container': { cpu: 20, memory: 40, network: 10 }
        };

        const baseline = baselines[serviceName] || { cpu: 30, memory: 50, network: 30 };
        
        data.push({
            time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            cpu: Math.max(0, baseline.cpu + Math.floor(Math.random() * 40) - 20),
            memory: Math.max(0, baseline.memory + Math.floor(Math.random() * 30) - 15),
            network: Math.max(0, baseline.network + Math.floor(Math.random() * 50) - 25),
            storage: Math.floor(Math.random() * 30) + 5,
        });
    }
    return data;
};

const services = [
    { name: 'ESXi-HOST-01', type: 'esxi', icon: Server },
    { name: 'ESXi-HOST-02', type: 'esxi', icon: Server },
    { name: 'Docker-Host-01', type: 'docker', icon: Container },
    { name: 'NAS-Storage', type: 'nas', icon: HardDrive },
    { name: 'Web-Server-VM', type: 'vm', icon: Activity },
    { name: 'DB-Server-VM', type: 'vm', icon: Activity },
    { name: 'nginx-container', type: 'container', icon: Container },
    { name: 'postgres-container', type: 'container', icon: Container },
];

const resourceConfig = {
    cpu: { name: 'CPU Usage', color: '#3B82F6', Icon: Cpu, unit: '%' },
    memory: { name: 'Memory Usage', color: '#10B981', Icon: MemoryStick, unit: '%' },
    network: { name: 'Network I/O', color: '#8B5CF6', Icon: Wifi, unit: 'Mbps' },
    storage: { name: 'Disk I/O', color: '#F59E0B', Icon: HardDrive, unit: 'MB/s' }
};

export default function SystemOverviewTimelineModal({ isOpen, onClose }) {
  const [selectedService, setSelectedService] = useState('ESXi-HOST-01');
  const [visibleResources, setVisibleResources] = useState({
      cpu: true,
      memory: true,
      network: false,
      storage: false,
  });

  const toggleVisibility = (resource) => {
    setVisibleResources(prev => ({ ...prev, [resource]: !prev[resource] }));
  };

  const currentData = generateServiceData(selectedService);
  const selectedServiceInfo = services.find(s => s.name === selectedService);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Performance Timeline"
      description="Detailed performance metrics across your infrastructure. Select a service and toggle resources to view."
      size="xl"
    >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
                <Label className="text-gray-300">Service:</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map(service => (
                            <SelectItem key={service.name} value={service.name}>
                                <div className="flex items-center gap-2">
                                    <service.icon className="w-4 h-4" />
                                    {service.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {Object.entries(resourceConfig).map(([key, { name, color, Icon }]) => (
                    <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        className={cn(
                            "transition-all duration-200 border-gray-600",
                            visibleResources[key] ? `bg-gray-700 text-gray-100` : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                        )}
                        style={visibleResources[key] ? { borderColor: color, boxShadow: `0 0 8px -2px ${color}` } : {}}
                        onClick={() => toggleVisibility(key)}
                    >
                        <Icon className="w-3 h-3 mr-1" style={{ color }} />
                        {name.split(' ')[0]}
                    </Button>
                ))}
            </div>
        </div>

      <div className="h-[50vh]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData}>
            <defs>
              <linearGradient id="cpuGradientSystem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={resourceConfig.cpu.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={resourceConfig.cpu.color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="memoryGradientSystem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={resourceConfig.memory.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={resourceConfig.memory.color} stopOpacity={0}/>
              </linearGradient>
               <linearGradient id="networkGradientSystem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={resourceConfig.network.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={resourceConfig.network.color} stopOpacity={0}/>
              </linearGradient>
               <linearGradient id="storageGradientSystem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={resourceConfig.storage.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={resourceConfig.storage.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} interval={3} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {visibleResources.cpu && <Area type="monotone" dataKey="cpu" name={resourceConfig.cpu.name} stroke={resourceConfig.cpu.color} fill="url(#cpuGradientSystem)" strokeWidth={2} unit={resourceConfig.cpu.unit} dot={false}/>}
            {visibleResources.memory && <Area type="monotone" dataKey="memory" name={resourceConfig.memory.name} stroke={resourceConfig.memory.color} fill="url(#memoryGradientSystem)" strokeWidth={2} unit={resourceConfig.memory.unit} dot={false}/>}
            {visibleResources.network && <Area type="monotone" dataKey="network" name={resourceConfig.network.name} stroke={resourceConfig.network.color} fill="url(#networkGradientSystem)" strokeWidth={2} unit={resourceConfig.network.unit} dot={false}/>}
            {visibleResources.storage && <Area type="monotone" dataKey="storage" name={resourceConfig.storage.name} stroke={resourceConfig.storage.color} fill="url(#storageGradientSystem)" strokeWidth={2} unit={resourceConfig.storage.unit} dot={false}/>}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
}