import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

const mockData = [
  { time: '00:00', cpu: 45, memory: 62, network: 23 },
  { time: '04:00', cpu: 42, memory: 58, network: 18 },
  { time: '08:00', cpu: 68, memory: 73, network: 42 },
  { time: '12:00', cpu: 73, memory: 81, network: 55 },
  { time: '16:00', cpu: 69, memory: 79, network: 48 },
  { time: '20:00', cpu: 52, memory: 67, network: 31 },
  { time: '24:00', cpu: 48, memory: 64, network: 27 },
];

export default function SystemOverview({ onClick, widget }) {
  return (
    <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-gray-100 flex items-center gap-2 ${widget?.w > 1 ? 'text-lg' : 'text-base'}`}>
          System Performance Overview
          {widget?.w > 2 && <span className="text-xs text-gray-400 font-normal ml-auto hidden sm:inline">Last 24 hours • Click for details</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 lg:gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs lg:text-sm text-gray-400">CPU Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-xs lg:text-sm text-gray-400">Memory Usage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}