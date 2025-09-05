
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Square,
  RotateCw,
  Settings,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VMControlPanelModal from './VMControlPanelModal'; // Import the new modal

const mockVMs = [
  {
    id: "vm1",
    name: "Web-Server-01",
    status: "running",
    os: "Ubuntu 22.04",
    cpu: 2,
    memory: 4,
    storage: 40,
    ip: "192.168.1.150",
    uptime: "15d 4h"
  },
  {
    id: "vm2",
    name: "Database-Server",
    status: "running",
    os: "CentOS 8",
    cpu: 4,
    memory: 8,
    storage: 100,
    ip: "192.168.1.151",
    uptime: "23d 12h"
  },
  {
    id: "vm3",
    name: "Dev-Environment",
    status: "stopped",
    os: "Windows Server 2019",
    cpu: 2,
    memory: 6,
    storage: 60,
    ip: "192.168.1.152",
    uptime: "0d 0h"
  },
  {
    id: "vm4",
    name: "Backup-Server",
    status: "running",
    os: "Ubuntu 20.04",
    cpu: 1,
    memory: 2,
    storage: 200,
    ip: "192.168.1.153",
    uptime: "8d 16h"
  }
];

export default function VMList({ hostId }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeVM, setActiveVM] = useState(null);

  const handleOpenPanel = (vm) => {
    setActiveVM(vm);
    setIsPanelOpen(true);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      running: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      stopped: "text-red-400 bg-red-400/20 border-red-400/30",
      paused: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      suspended: "text-orange-400 bg-orange-400/20 border-orange-400/30"
    };
    return colors[status] || colors.stopped;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-3 h-3" />;
      case 'stopped': return <Square className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Square className="w-3 h-3" />;
    }
  };

  const getOSIcon = (os) => {
    if (os.toLowerCase().includes('ubuntu') || os.toLowerCase().includes('centos')) return '🐧';
    if (os.toLowerCase().includes('windows')) return '🪟';
    return '💻';
  };

  const handleAction = (e, action, vmName) => {
    e.stopPropagation(); // Prevent modal from opening when clicking a button
    toast.info(`${action} for VM: ${vmName}`);
  };

  return (
    <>
      <VMControlPanelModal
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        vm={activeVM}
      />
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-100 flex items-center gap-2">
                Virtual Machines
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                  {mockVMs.length} total
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {mockVMs.map((vm, index) => (
                <motion.div
                  key={vm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-blue-500 transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenPanel(vm)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getOSIcon(vm.os)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                          {vm.name}
                          <Badge className={`${getStatusColor(vm.status)} border text-xs`}>
                            {getStatusIcon(vm.status)}
                            <span className="ml-1 capitalize">{vm.status}</span>
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-400">{vm.os} • {vm.ip}</p>
                      </div>
                    </div>
  
                    <div className="flex gap-1">
                      {vm.status === 'stopped' ? (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={(e) => handleAction(e, 'Starting', vm.name)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={(e) => handleAction(e, 'Pausing', vm.name)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={(e) => handleAction(e, 'Stopping', vm.name)}>
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={(e) => handleAction(e, 'Configuring', vm.name)}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-gray-400">CPU</div>
                        <div className="font-semibold text-gray-100">{vm.cpu} cores</div>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                      <MemoryStick className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-gray-400">Memory</div>
                        <div className="font-semibold text-gray-100">{vm.memory}GB</div>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                      <HardDrive className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="text-gray-400">Storage</div>
                        <div className="font-semibold text-gray-100">{vm.storage}GB</div>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-gray-400">Status</div>
                        <div className="font-semibold text-gray-100 capitalize">{vm.status}</div>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                      <div className="w-4 h-4 text-pink-400">⏰</div>
                      <div>
                        <div className="text-gray-400">Uptime</div>
                        <div className="font-semibold text-gray-100">{vm.uptime}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
