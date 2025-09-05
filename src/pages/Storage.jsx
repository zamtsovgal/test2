
import React, { useState, useEffect } from "react";
import { Server } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  HardDrive, 
  Database, 
  FolderOpen, 
  Users, 
  Activity,
  Wifi,
  Settings,
  Plus,
  FileText,
  Lock,
  Unlock,
  Edit
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import AddShareModal from "../components/storage/AddShareModal";
import AddStorageModal from "../components/storage/AddStorageModal"; // Added import

const mockStorageData = [
  { name: 'Documents', value: 450, color: '#3B82F6' },
  { name: 'Media', value: 1200, color: '#10B981' },
  { name: 'Backups', value: 800, color: '#F59E0B' },
  { name: 'VMs', value: 600, color: '#8B5CF6' },
  { name: 'Other', value: 250, color: '#EF4444' },
];

const mockShares = [
  {
    id: 1,
    name: "Public",
    path: "/volume1/Public",
    size: "245 GB",
    files: 1247,
    access: "public",
    protocol: ["SMB", "NFS"],
    active_connections: 3
  },
  {
    id: 2,
    name: "Media Library",
    path: "/volume1/Media",
    size: "1.2 TB",
    files: 8934,
    access: "private",
    protocol: ["SMB", "DLNA"],
    active_connections: 8
  },
  {
    id: 3,
    name: "Backups",
    path: "/volume1/Backups",
    size: "800 GB",
    files: 156,
    access: "restricted",
    protocol: ["SSH", "rsync"],
    active_connections: 1
  },
  {
    id: 4,
    name: "Documents",
    path: "/volume1/Documents",
    size: "89 GB",
    files: 3421,
    access: "private",
    protocol: ["SMB", "WebDAV"],
    active_connections: 5
  }
];

const mockPerformanceData = [
  { time: '00:00', read: 45, write: 28 },
  { time: '04:00', read: 12, write: 8 },
  { time: '08:00', read: 78, write: 45 },
  { time: '12:00', read: 95, write: 67 },
  { time: '16:00', read: 112, write: 89 },
  { time: '20:00', read: 89, write: 56 },
  { time: '24:00', read: 67, write: 34 },
];

export default function StoragePage() {
  const [storageServers, setStorageServers] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShare, setEditingShare] = useState(null);
  const [isAddStorageModalOpen, setIsAddStorageModalOpen] = useState(false); // Added state

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    const servers = await Server.filter({ type: "nas" });
    
    const mockServers = servers.length > 0 ? servers : [
      {
        id: "storage1",
        name: "Synology-DS920+",
        type: "nas",
        host: "192.168.1.200",
        status: "online",
        tags: ["primary", "raid5"]
      }
    ];
    
    setStorageServers(mockServers);
    if (mockServers.length > 0) {
      setSelectedStorage(mockServers[0]);
    }
  };

  const handleOpenModal = (share = null) => {
    setEditingShare(share);
    setIsModalOpen(true);
  };

  const handleSaveShare = (shareData) => {
    if (editingShare) {
      toast.success(`Share "${shareData.name}" updated successfully!`);
    } else {
      toast.success(`Share "${shareData.name}" created successfully!`);
    }
    setIsModalOpen(false);
  };

  const handleSaveStorage = (storageData) => { // Added function
    toast.success(`Storage system "${storageData.name}" added successfully!`);
    setIsAddStorageModalOpen(false);
    loadStorageData(); // Reload data to show new storage
  };

  const getAccessIcon = (access) => {
    switch (access) {
      case 'public': return <Unlock className="w-4 h-4 text-emerald-400" />;
      case 'private': return <Users className="w-4 h-4 text-blue-400" />;
      case 'restricted': return <Lock className="w-4 h-4 text-red-400" />;
      default: return <Lock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      <AddShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShare}
        share={editingShare}
      />
      <AddStorageModal // Added modal component
        isOpen={isAddStorageModalOpen}
        onClose={() => setIsAddStorageModalOpen(false)}
        onSave={handleSaveStorage}
      />
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Storage</h1>
            <p className="text-gray-400">Manage your network attached storage systems</p>
          </div>
          <div className="flex gap-2"> {/* Grouped buttons */}
            <Button onClick={() => setIsAddStorageModalOpen(true)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700"> {/* Added Add Storage button */}
              <Plus className="w-4 h-4 mr-2" />
              Add Storage
            </Button>
            <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Share
            </Button>
          </div>
        </div>

        {/* Storage Server Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStorage(server)}
              className={`p-4 bg-gray-800 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/50 ${
                selectedStorage?.id === server.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-gray-100">{server.name}</h3>
                    <p className="text-xs text-gray-400">{server.host}</p>
                  </div>
                </div>
                <Badge className="text-emerald-400 bg-emerald-400/20 border-emerald-400/30">
                  {server.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">Shares</div>
                  <div className="font-semibold text-blue-400">{mockShares.length}</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">Used</div>
                  <div className="font-semibold text-emerald-400">3.3TB</div>
                </div>
                <div className="text-center p-2 bg-gray-700/50 rounded">
                  <div className="text-gray-400">Free</div>
                  <div className="font-semibold text-purple-400">4.7TB</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedStorage && (
          <>
            {/* Storage Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Capacity</CardTitle>
                    <Database className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">8.0 TB</div>
                  <Progress value={41.25} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">3.3TB used</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Shares</CardTitle>
                    <FolderOpen className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">{mockShares.length}</div>
                  <p className="text-xs text-gray-500">Network shares configured</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Connections</CardTitle>
                    <Wifi className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {mockShares.reduce((total, share) => total + share.active_connections, 0)}
                  </div>
                  <p className="text-xs text-gray-500">Users connected</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Files</CardTitle>
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-100">
                    {(mockShares.reduce((total, share) => total + share.files, 0) / 1000).toFixed(1)}k
                  </div>
                  <p className="text-xs text-gray-500">Files stored</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-800 border border-gray-700">
                <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">Overview</TabsTrigger>
                <TabsTrigger value="shares" className="data-[state=active]:bg-emerald-600">Network Shares</TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-emerald-600">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Storage Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockStorageData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {mockStorageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-100">Storage Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">RAID Status</span>
                          <Badge className="text-emerald-400 bg-emerald-400/20">Healthy</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Temperature</span>
                          <span className="text-gray-100">42°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Drive Status</span>
                          <Badge className="text-emerald-400 bg-emerald-400/20">All Drives OK</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Last Scrub</span>
                          <span className="text-gray-100">3 days ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-gray-100">45d 12h 34m</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shares" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100 flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Network Shares
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockShares.map((share, index) => (
                        <motion.div
                          key={share.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getAccessIcon(share.access)}
                              <div>
                                <h3 className="font-semibold text-gray-100">{share.name}</h3>
                                <p className="text-sm text-gray-400">{share.path}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={() => handleOpenModal(share)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Size:</span>
                              <span className="ml-2 font-medium text-gray-100">{share.size}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Files:</span>
                              <span className="ml-2 font-medium text-gray-100">{share.files.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Connections:</span>
                              <span className="ml-2 font-medium text-gray-100">{share.active_connections}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Access:</span>
                              <Badge className={
                                share.access === 'public' ? 'text-emerald-400 bg-emerald-400/20' :
                                share.access === 'private' ? 'text-blue-400 bg-blue-400/20' :
                                'text-red-400 bg-red-400/20'
                              }>
                                {share.access}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            {share.protocol.map((proto) => (
                              <Badge key={proto} variant="outline" className="border-gray-600 text-gray-300">
                                {proto}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100">I/O Performance (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockPerformanceData}>
                          <defs>
                            <linearGradient id="readGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="writeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Area
                            type="monotone"
                            dataKey="read"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#readGradient)"
                            strokeWidth={2}
                            name="Read MB/s"
                          />
                          <Area
                            type="monotone"
                            dataKey="write"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#writeGradient)"
                            strokeWidth={2}
                            name="Write MB/s"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-400">Read Speed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-400">Write Speed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!selectedStorage && storageServers.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <HardDrive className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">No Storage Systems Found</h3>
              <p className="text-gray-400 mb-4">Add your first storage system to get started monitoring</p>
              <Button onClick={() => setIsAddStorageModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700"> {/* Updated onClick */}
                <Plus className="w-4 h-4 mr-2" />
                Add Storage System
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
