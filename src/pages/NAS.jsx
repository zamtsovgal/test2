
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
import AddShareModal from "../components/nas/AddShareModal";

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

export default function NASPage() {
  const [nasServers, setNasServers] = useState([]);
  const [selectedNAS, setSelectedNAS] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShare, setEditingShare] = useState(null);

  useEffect(() => {
    loadNASData();
  }, []);

  const loadNASData = async () => {
    const servers = await Server.filter({ type: "nas" });
    
    const mockServers = servers.length > 0 ? servers : [
      {
        id: "nas1",
        name: "Synology-DS920+",
        type: "nas",
        host: "192.168.1.200",
        status: "online",
        tags: ["primary", "raid5"]
      }
    ];
    
    setNasServers(mockServers);
    if (mockServers.length > 0) {
      setSelectedNAS(mockServers[0]);
    }
  };

  const handleOpenModal = (share = null) => {
    setEditingShare(share);
    setIsModalOpen(true);
  };

  const handleSaveShare = (shareData) => {
    if (editingShare) {
      toast.success(`Share "${shareData.name}" updated successfully!`);
      // In a real application, you'd update your shares state here
      // For example: setMockShares(prevShares => prevShares.map(s => s.id === shareData.id ? shareData : s));
    } else {
      toast.success(`Share "${shareData.name}" created successfully!`);
      // In a real application, you'd add the new share to your shares state here
      // For example: setMockShares(prevShares => [...prevShares, { ...shareData, id: Date.now() }]);
    }
    setIsModalOpen(false); // Close modal after saving
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
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">NAS Storage</h1>
            <p className="text-gray-400">Manage your network attached storage systems</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Share
          </Button>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">8.0 TB</div>
              <Progress value={68} className="h-2 mt-2" />
              <p className="text-xs text-gray-500 mt-1">5.4 TB used</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{mockShares.length}</div>
              <p className="text-xs text-gray-500 mt-1">Network shares active</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">17</div>
              <p className="text-xs text-gray-500 mt-1">Active user connections</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-400 font-semibold">Healthy</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Usage Breakdown */}
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
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
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

          {/* Performance Chart */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-gray-100">I/O Performance</CardTitle>
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
                    />
                    <Area
                      type="monotone"
                      dataKey="write"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#writeGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Read MB/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Write MB/s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Shares */}
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-6 h-6 text-blue-400" />
                      <div>
                        <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                          {share.name}
                          {getAccessIcon(share.access)}
                        </h3>
                        <p className="text-sm text-gray-400">{share.path}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {share.protocol.map(protocol => (
                        <Badge key={protocol} className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                          {protocol}
                        </Badge>
                      ))}
                      <Button size="icon" variant="ghost" onClick={() => handleOpenModal(share)}>
                        <Edit className="w-4 h-4 text-gray-400 hover:text-gray-100" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-gray-600/30 rounded">
                      <div className="text-gray-400">Size</div>
                      <div className="font-semibold text-gray-100">{share.size}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-600/30 rounded">
                      <div className="text-gray-400">Files</div>
                      <div className="font-semibold text-emerald-400">{share.files.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-600/30 rounded">
                      <div className="text-gray-400">Access</div>
                      <div className={`font-semibold capitalize ${
                        share.access === 'public' ? 'text-emerald-400' :
                        share.access === 'private' ? 'text-blue-400' : 'text-red-400'
                      }`}>
                        {share.access}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-600/30 rounded">
                      <div className="text-gray-400">Connections</div>
                      <div className="font-semibold text-purple-400">{share.active_connections}</div>
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
