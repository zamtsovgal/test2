
import React, { useState, useEffect } from "react";
import { Server } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Container, 
  Play, 
  Pause, 
  Square, 
  RotateCw,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Plus,
  Settings,
  Download,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import DockerContainerList from "../components/docker/DockerContainerList";
import DockerImageList from "../components/docker/DockerImageList";
import PullImageModal from "../components/docker/PullImageModal";
import CreateContainerModal from "../components/docker/CreateContainerModal";
import DockerContainerControlPanelModal from "../components/docker/DockerContainerControlPanelModal";

const mockContainers = [
  { id: "cont1", name: "nginx-proxy", image: "nginx:latest", status: "running", uptime: "5d 12h", cpu: 2.3, memory: 45.2, ports: "80:80, 443:443", network: "bridge" },
  { id: "cont2", name: "postgres-db", image: "postgres:13", status: "running", uptime: "12d 8h", cpu: 8.7, memory: 256.5, ports: "5432:5432", network: "db-network" },
  { id: "cont3", name: "redis-cache", image: "redis:alpine", status: "running", uptime: "3d 2h", cpu: 1.2, memory: 32.8, ports: "6379:6379", network: "cache-network" },
  { id: "cont4", name: "monitoring-app", image: "grafana/grafana:latest", status: "stopped", uptime: "0d 0h", cpu: 0, memory: 0, ports: "3000:3000", network: "monitoring" },
  { id: "cont5", name: "portainer-agent", image: "portainer/agent:latest", status: "running", uptime: "22d 1h", cpu: 0.5, memory: 15.6, ports: "9001:9001", network: "host" },
  { id: "cont6", name: "watchtower", image: "containrrr/watchtower", status: "restarting", uptime: "1h 30m", cpu: 0.1, memory: 8.2, ports: "", network: "bridge" },
];

const mockImages = [
  { id: "img1", name: "nginx", tag: "latest", size: "142MB", created: "2 days ago" },
  { id: "img2", name: "postgres", tag: "13", size: "374MB", created: "5 days ago" },
  { id: "img3", name: "redis", tag: "alpine", size: "32MB", created: "1 week ago" },
  { id: "img4", name: "grafana/grafana", tag: "latest", size: "256MB", created: "3 days ago" },
  { id: "img5", name: "portainer/portainer-ce", tag: "latest", size: "79MB", created: "1 week ago" },
  { id: "img6", name: "containrrr/watchtower", tag: "latest", size: "12MB", created: "1 day ago" },
];

const mockResourceData = [
  { time: '24h ago', cpu: 15.2, memory: 45.1, network: 12.3 },
  { time: '20h ago', cpu: 8.5, memory: 42.6, network: 8.9 },
  { time: '16h ago', cpu: 25.1, memory: 48.2, network: 24.5 },
  { time: '12h ago', cpu: 35.7, memory: 55.8, network: 45.1 },
  { time: '8h ago', cpu: 42.3, memory: 62.4, network: 38.2 },
  { time: '4h ago', cpu: 28.9, memory: 52.1, network: 28.7 },
  { time: 'now', cpu: 18.4, memory: 46.3, network: 15.6 },
];

export default function DockerPage() {
  const [dockerServers, setDockerServers] = useState([]);
  const [containers, setContainers] = useState(mockContainers);
  const [images, setImages] = useState(mockImages);
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [imageToRun, setImageToRun] = useState(null);
  const [isContainerPanelOpen, setIsContainerPanelOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your Docker hosts
    // For now, we use mock data.
  }, []);
  
  const handlePullImage = (imageName) => {
    toast.info(`Pulling image: ${imageName}`);
    // Simulate API call to Docker daemon
    setTimeout(() => {
      const [name, tag = 'latest'] = imageName.split(':');
      const newImage = {
        id: `img${images.length + 1}`,
        name,
        tag,
        size: `${(Math.random() * 400).toFixed(1)}MB`,
        created: 'just now',
      };
      setImages([newImage, ...images]);
      toast.success(`Successfully pulled ${imageName}`);
    }, 3000);
  };

  const handleCreateContainer = (containerConfig) => {
    toast.info(`Creating container: ${containerConfig.name}`);
    setTimeout(() => {
      const newContainer = {
        id: `cont${containers.length + 1}`,
        status: 'running',
        uptime: 'just now',
        cpu: 0,
        memory: 0,
        ...containerConfig,
      };
      setContainers([newContainer, ...containers]);
      toast.success(`Container "${containerConfig.name}" created and started successfully!`);
    }, 2000);
  };

  const handleRunFromImage = (image) => {
    setImageToRun(image);
    setIsCreateModalOpen(true);
  };
  
  const handleContainerAction = (containerId, action) => {
    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        let newStatus = c.status;
        switch(action) {
          case 'start': newStatus = 'running'; break;
          case 'stop': newStatus = 'stopped'; break;
          case 'restart': newStatus = 'restarting'; 
            setTimeout(() => setContainers(p => p.map(pc => pc.id === containerId ? {...pc, status: 'running'} : pc)), 2000);
            break;
          case 'pause': newStatus = 'paused'; break;
          case 'resume': newStatus = 'running'; break;
          default: break;
        }
        toast.success(`Container ${c.name} ${action}ed.`);
        return {...c, status: newStatus};
      }
      return c;
    }));
  };

  const handleRemoveContainer = (containerId) => {
    const container = containers.find(c => c.id === containerId);
    if(window.confirm(`Are you sure you want to remove container "${container.name}"?`)){
      setContainers(prev => prev.filter(c => c.id !== containerId));
      toast.success(`Container "${container.name}" removed.`);
    }
  };

  const handleRemoveImage = (imageId) => {
    const image = images.find(img => img.id === imageId);
    if(window.confirm(`Are you sure you want to remove image "${image.name}:${image.tag}"?`)){
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success(`Image "${image.name}:${image.tag}" removed.`);
    }
  };

  const handleOpenContainerPanel = (container) => {
    setSelectedContainer(container);
    setIsContainerPanelOpen(true);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      running: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      stopped: "text-red-400 bg-red-400/20 border-red-400/30",
      paused: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      restarting: "text-blue-400 bg-blue-400/20 border-blue-400/30"
    };
    return colors[status] || colors.stopped;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-3 h-3" />;
      case 'stopped': return <Square className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'restarting': return <RotateCw className="w-3 h-3 animate-spin" />;
      default: return <Square className="w-3 h-3" />;
    }
  };

  return (
    <>
      <PullImageModal isOpen={isPullModalOpen} onClose={() => setIsPullModalOpen(false)} onPull={handlePullImage} />
      <CreateContainerModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateContainer} image={imageToRun} />
      <DockerContainerControlPanelModal
        isOpen={isContainerPanelOpen}
        onClose={() => setIsContainerPanelOpen(false)}
        container={selectedContainer}
        onAction={handleContainerAction}
      />
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Docker Management</h1>
            <p className="text-gray-400">Monitor and manage your containerized applications on Docker-Host-01</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsPullModalOpen(true)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Pull Image
            </Button>
            <Button onClick={() => { setImageToRun(null); setIsCreateModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Container
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overview Cards */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Containers</CardTitle>
              <Container className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{containers.filter(c => c.status === 'running').length} / {containers.length}</div>
              <p className="text-xs text-gray-500">Running / Total</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Images</CardTitle>
              <ImageIcon className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{images.length}</div>
              <p className="text-xs text-gray-500">Local Images</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">CPU Usage</CardTitle>
              <Cpu className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">12.5%</div>
              <Progress value={12.5} className="h-2 mt-1" />
              <p className="text-xs text-gray-500 mt-1">Total across running containers</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Memory Usage</CardTitle>
              <MemoryStick className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">353.3 MB</div>
              <Progress value={8.6} className="h-2 mt-1" />
              <p className="text-xs text-gray-500 mt-1">of 4GB Total</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader><CardTitle className="text-gray-100">Total Resource Usage (24h)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockResourceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                  <Legend />
                  <Line type="monotone" dataKey="cpu" name="CPU" stroke="#3B82F6" strokeWidth={2} dot={false} unit="%" />
                  <Line type="monotone" dataKey="memory" name="Memory" stroke="#10B981" strokeWidth={2} dot={false} unit="%" />
                  <Line type="monotone" dataKey="network" name="Network" stroke="#F59E0B" strokeWidth={2} dot={false} unit=" MB/s" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="containers" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="containers" className="data-[state=active]:bg-blue-600">
              <Container className="w-4 h-4 mr-2" />Containers ({containers.length})
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-blue-600">
              <ImageIcon className="w-4 h-4 mr-2" />Images ({images.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="containers">
            <DockerContainerList
              containers={containers}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onAction={handleContainerAction}
              onRemove={handleRemoveContainer}
              onSelect={handleOpenContainerPanel}
            />
          </TabsContent>
          <TabsContent value="images">
            <DockerImageList 
              images={images} 
              onRun={handleRunFromImage}
              onRemove={handleRemoveImage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
