
import React, { useState, useEffect } from "react";
import { Server } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server as ServerIcon,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Play,
  Pause,
  Square,
  RotateCw,
  Settings,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import VMList from "../components/esxi/VMList";
import HostResources from "../components/esxi/HostResources";
import DatastoreView from "../components/esxi/DatastoreView";
import HostConfigurationModal from "../components/esxi/HostConfigurationModal";
import HostControlPanelModal from "../components/esxi/HostControlPanelModal"; // New import for the control panel modal

export default function ESXiPage() {
  const [esxiServers, setEsxiServers] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);
  const [activeTab, setActiveTab] = useState("vms");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false); // Renamed from isModalOpen for clarity
  const [editingHost, setEditingHost] = useState(null);
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(false); // State for the new Host Control Panel modal

  useEffect(() => {
    loadESXiData();
  }, []);

  const loadESXiData = async () => {
    const servers = await Server.filter({ type: "esxi" });

    // Add mock data if no servers exist
    const mockServers = servers.length > 0 ? servers : [
      {
        id: "1",
        name: "ESXi-HOST-01",
        type: "esxi",
        host: "192.168.1.100",
        status: "online",
        tags: ["production", "primary"]
      },
      {
        id: "2",
        name: "ESXi-HOST-02",
        type: "esxi",
        host: "192.168.1.101",
        status: "online",
        tags: ["production", "secondary"]
      }
    ];

    setEsxiServers(mockServers);
    if (mockServers.length > 0) {
      setSelectedHost(mockServers[0]);
    }
  };

  const handleRefresh = () => {
    toast.info("Refreshing host data...");
    loadESXiData();
  };

  const handleOpenConfigModal = (host = null) => { // Renamed from handleOpenModal
    setEditingHost(host);
    setIsConfigModalOpen(true);
  };

  const handleSaveHost = (hostData) => {
    // In a real application, you would typically interact with an API
    // (e.g., Server.create(hostData) or Server.update(hostData.id, hostData))
    console.log("Saving host:", hostData);
    if(editingHost) {
      toast.success(`Host "${hostData.name}" updated successfully!`);
    } else {
      toast.success(`Host "${hostData.name}" added successfully!`);
    }
    // Close the modal and refresh the host list
    setIsConfigModalOpen(false); // Use the new state variable
    loadESXiData();
  };

  const getStatusColor = (status) => {
    const colors = {
      online: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      offline: "text-gray-400 bg-gray-400/20 border-gray-400/30",
      warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      error: "text-red-400 bg-red-400/20 border-red-400/30"
    };
    return colors[status] || colors.offline;
  };

  return (
    <>
      <HostConfigurationModal
        isOpen={isConfigModalOpen} // Use the new state variable
        onClose={() => setIsConfigModalOpen(false)} // Use the new state variable
        onSave={handleSaveHost}
        host={editingHost}
      />
      <HostControlPanelModal // Add the new modal component here
        isOpen={isHostPanelOpen}
        onClose={() => setIsHostPanelOpen(false)}
        host={selectedHost}
      />
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">ESXi & vCenter</h1>
            <p className="text-gray-400">Monitor and manage your virtualization infrastructure</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RotateCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => handleOpenConfigModal()} className="bg-blue-600 hover:bg-blue-700"> {/* Use the new function */}
              <Plus className="w-4 h-4 mr-2" />
              Add Host
            </Button>
          </div>
        </div>

        {/* Host Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {esxiServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedHost(server)}
              className={`p-4 bg-gray-800 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/50 ${
                selectedHost?.id === server.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ServerIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-gray-100">{server.name}</h3>
                    <p className="text-xs text-gray-400">{server.host}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(server.status)} border`}>
                  {server.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">VMs</div>
                  <div className="font-semibold text-blue-400">{Math.floor(Math.random() * 10) + 5}</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">CPU</div>
                  <div className="font-semibold text-emerald-400">{Math.floor(Math.random() * 30) + 40}%</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">Memory</div>
                  <div className="font-semibold text-purple-400">{Math.floor(Math.random() * 20) + 60}%</div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHost(server);
                    setIsHostPanelOpen(true);
                  }}
                >
                  <Activity className="w-3 h-3 mr-1"/> Control Panel
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfigModal(server);
                  }}
                >
                  <Settings className="w-3 h-3 mr-1"/> Configure
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedHost && (
          <Tabs defaultValue="vms" className="space-y-6">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="vms" className="data-[state=active]:bg-blue-600">Virtual Machines</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-blue-600">Host Resources</TabsTrigger>
              <TabsTrigger value="datastores" className="data-[state=active]:bg-blue-600">Datastores</TabsTrigger>
            </TabsList>

            <TabsContent value="vms" className="space-y-6">
              <VMList hostId={selectedHost.id} />
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              {/* onOpenTimelineModal now opens the HostControlPanelModal */}
              <HostResources hostId={selectedHost.id} onOpenTimelineModal={() => setIsHostPanelOpen(true)} />
            </TabsContent>

            <TabsContent value="datastores" className="space-y-6">
              <DatastoreView hostId={selectedHost.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
