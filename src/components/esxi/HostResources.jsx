
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";

const mockResourceData = [
  { time: '00:00', cpu: 42, memory: 65, storage: 78 },
  { time: '04:00', cpu: 38, memory: 61, storage: 78 },
  { time: '08:00', cpu: 55, memory: 72, storage: 79 },
  { time: '12:00', cpu: 68, memory: 81, storage: 79 },
  { time: '16:00', cpu: 71, memory: 84, storage: 80 },
  { time: '20:00', cpu: 58, memory: 75, storage: 80 },
  { time: '24:00', cpu: 45, memory: 68, storage: 80 },
];

export default function HostResources({ hostId, onOpenTimelineModal }) {
  const currentResources = {
    cpu: { used: 68, total: 100, cores: 16, ghz: 2.4 },
    memory: { used: 24, total: 32, percentage: 75 },
    storage: { used: 800, total: 1000, percentage: 80 },
    network: { in: 125, out: 89, percentage: 32 }
  };

  return (
    <div className="space-y-6">
      {/* Current Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">CPU Usage</CardTitle>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100 mb-2">{currentResources.cpu.used}%</div>
            <Progress value={currentResources.cpu.used} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">
              {currentResources.cpu.cores} cores @ {currentResources.cpu.ghz}GHz
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Memory</CardTitle>
              <MemoryStick className="w-4 h-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100 mb-2">{currentResources.memory.percentage}%</div>
            <Progress value={currentResources.memory.percentage} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">
              {currentResources.memory.used}GB / {currentResources.memory.total}GB
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Storage</CardTitle>
              <HardDrive className="w-4 h-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100 mb-2">{currentResources.storage.percentage}%</div>
            <Progress value={currentResources.storage.percentage} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">
              {currentResources.storage.used}GB / {currentResources.storage.total}GB
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Network</CardTitle>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100 mb-2">{currentResources.network.percentage}%</div>
            <Progress value={currentResources.network.percentage} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">
              ↓ {currentResources.network.in}MB/s ↑ {currentResources.network.out}MB/s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage Chart */}
      <Card 
        className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
        onClick={onOpenTimelineModal}
      >
        <CardHeader>
          <CardTitle className="text-gray-100 flex justify-between items-center">
            Resource Usage Trends
            <span className="text-xs font-normal text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view timeline →</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockResourceData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#cpuGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#memoryGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="storage"
                  stroke="#F59E0B"
                  fillOpacity={1}
                  fill="url(#storageGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Storage</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
