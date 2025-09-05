
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, MemoryStick, HardDrive, Wifi, Server, Activity, Container } from "lucide-react";

const services = [
  { id: 'esxi1', name: 'ESXi-HOST-01', type: 'host', icon: Server },
  { id: 'esxi2', name: 'ESXi-HOST-02', type: 'host', icon: Server },
  { id: 'vm1', name: 'Web-Server-VM', type: 'vm', icon: Activity },
  { id: 'vm2', name: 'DB-Server-VM', type: 'vm', icon: Activity },
  { id: 'docker1', name: 'Docker-Host', type: 'host', icon: Container },
  { id: 'nas1', name: 'NAS-Storage', type: 'storage', icon: HardDrive },
];

const getResourceData = (serviceId, widget) => {
  const allResources = {
    'esxi1': [
      { name: "CPU", value: 68, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 73, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 45, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 32, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
    'esxi2': [
      { name: "CPU", value: 45, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 62, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 38, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 28, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
    'vm1': [
      { name: "CPU", value: 85, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 78, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 25, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 42, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
    'vm2': [
      { name: "CPU", value: 42, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 89, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 67, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 15, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
    'docker1': [
      { name: "CPU", value: 25, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 35, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 12, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 55, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
    'nas1': [
      { name: "CPU", value: 15, icon: Cpu, color: "bg-blue-500", textColor: "text-blue-400" },
      { name: "Memory", value: 28, icon: MemoryStick, color: "bg-emerald-500", textColor: "text-emerald-400" },
      { name: "Storage", value: 85, icon: HardDrive, color: "bg-orange-500", textColor: "text-orange-400" },
      { name: "Network", value: 72, icon: Wifi, color: "bg-purple-500", textColor: "text-purple-400" },
    ],
  };
  
  const resourceConfigs = allResources[serviceId] || allResources['esxi1'];

  if (widget?.h === 1) { // Show only CPU and Memory if small height
    return resourceConfigs.slice(0, 2); 
  }
  return resourceConfigs;
};

export default function ResourceMonitor({ widget }) {
  const [selectedService, setSelectedService] = useState('esxi1');
  const resources = getResourceData(selectedService, widget);
  const selectedServiceInfo = services.find(s => s.id === selectedService);

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader onClick={(e) => e.stopPropagation()} className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-100 text-base lg:text-lg">Resource Usage</CardTitle>
          {widget?.w > 1 && ( // Only show select if width is greater than 1
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-32 lg:w-40 bg-gray-700 border-gray-600 text-gray-100 text-xs lg:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center gap-2">
                      <service.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">{service.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {selectedServiceInfo && widget?.w > 1 && ( // Only show monitoring info if width is greater than 1
          <p className="text-xs lg:text-sm text-gray-400 flex items-center gap-1 mt-1">
            <selectedServiceInfo.icon className="w-3 h-3 lg:w-4 lg:h-4" />
            Monitoring: {selectedServiceInfo.name}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 flex-grow overflow-y-auto">
        {resources.map((resource) => (
          <div key={resource.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <resource.icon className={`w-3 h-3 lg:w-4 lg:h-4 ${resource.textColor}`} />
                <span className="text-xs lg:text-sm font-medium text-gray-300">{resource.name}</span>
              </div>
              <span className="text-xs lg:text-sm font-semibold text-gray-100">{resource.value}%</span>
            </div>
            <div className="relative">
              <Progress value={resource.value} className="h-2 bg-gray-700" />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full ${resource.color} transition-all duration-500`}
                style={{ width: `${resource.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
