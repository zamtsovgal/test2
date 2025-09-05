import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, MemoryStick, HardDrive, Wifi, RefreshCw, Wrench, Power } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { toast } from "sonner";
import { motion } from "framer-motion";

const generateTimelineData = (baseCpu, baseMem) => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        cpu: Math.max(5, baseCpu + Math.floor(Math.random() * 20) - 10),
        memory: Math.max(10, baseMem + Math.floor(Math.random() * 15) - 7),
        network: Math.max(2, 20 + Math.floor(Math.random() * 30) - 15),
        storage: Math.max(1, 15 + Math.floor(Math.random() * 20) - 10),
    }));
};

export default function HostControlPanelModal({ isOpen, onClose, host }) {
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        if (isOpen && host) {
            setTimelineData(generateTimelineData(40, 60)); // Initial data
            
            const interval = setInterval(() => {
                setTimelineData(prevData => {
                    const lastPoint = prevData[prevData.length - 1] || { time: 0, cpu: 40, memory: 60, network: 20, storage: 15 };
                    const nextPoint = {
                        time: lastPoint.time + 1,
                        cpu: Math.max(5, lastPoint.cpu + Math.floor(Math.random() * 8) - 4),
                        memory: Math.max(10, lastPoint.memory + Math.floor(Math.random() * 6) - 3),
                        network: Math.max(2, lastPoint.network + Math.floor(Math.random() * 10) - 5),
                        storage: Math.max(1, lastPoint.storage + Math.floor(Math.random() * 8) - 4),
                    };
                    return [...prevData.slice(1), nextPoint];
                });
            }, 2500);

            return () => clearInterval(interval);
        }
    }, [isOpen, host]);

    if (!host) return null;

    const footer = (
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </>
    );

    const getStatusColor = (status) => {
        const colors = {
          online: "text-emerald-400 bg-emerald-400/20",
          offline: "text-red-400 bg-red-400/20",
          warning: "text-yellow-400 bg-yellow-400/20",
        };
        return colors[status] || colors.offline;
    };
    
    const resourceConfig = {
        cpu: { name: 'CPU Usage', color: '#3B82F6', unit: '%' },
        memory: { name: 'Memory Usage', color: '#10B981', unit: '%' },
        network: { name: 'Network I/O', color: '#8B5CF6', unit: 'Mbps' },
        storage: { name: 'Disk I/O', color: '#F59E0B', unit: 'MB/s' }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Host Control Panel: ${host.name}`}
            description={`Manage and monitor the ESXi host.`}
            size="xl"
            footer={footer}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Action Buttons */}
                <div className="md:col-span-1 space-y-3 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-2">Host Actions</h3>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => toast.info(`Refreshing data for ${host.name}`)} className="w-full justify-start text-lg py-6 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300">
                            <RefreshCw className="w-5 h-5 mr-3"/> Refresh
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => toast.warning(`Placing ${host.name} into maintenance mode.`)} className="w-full justify-start text-lg py-6 bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300">
                            <Wrench className="w-5 h-5 mr-3"/> Maintenance
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => toast.error(`Rebooting host ${host.name}`)} className="w-full justify-start text-lg py-6 bg-red-600/20 border border-red-500/30 hover:bg-red-500/30 text-red-300">
                            <Power className="w-5 h-5 mr-3"/> Reboot Host
                        </Button>
                    </motion.div>
                </div>
                
                {/* Details & Resources */}
                <div className="md:col-span-3 space-y-4">
                    <div className="p-4 bg-gray-700/30 border border-gray-600/50 rounded-lg">
                         <h3 className="text-lg font-semibold text-gray-200 mb-3">Host Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Hostname:</span> <span className="font-semibold text-gray-200">{host.name}</span></div>
                            <div><span className="text-gray-400">IP Address:</span> <span className="font-semibold text-gray-200">{host.host}</span></div>
                            <div><span className="text-gray-400">Status:</span> <Badge className={`${getStatusColor(host.status)}`}>{host.status}</Badge></div>
                             <div><span className="text-gray-400">VMs:</span> <span className="font-semibold text-gray-200">{Math.floor(Math.random() * 10) + 5} running</span></div>
                        </div>
                    </div>
                    
                    <div className="h-64">
                         <h4 className="text-lg font-semibold text-gray-200 mb-2">Live Performance</h4>
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                                <defs>
                                    {Object.entries(resourceConfig).map(([key, { color }]) => (
                                        <linearGradient key={key} id={`${key}ColorHost`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                                <XAxis dataKey="time" hide={true} />
                                <YAxis stroke="#9CA3AF" fontSize={10} width={30} unit="%" domain={[0, 100]}/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                    formatter={(value, name) => [`${value.toFixed(1)}${resourceConfig[name]?.unit || ''}`, resourceConfig[name]?.name]}
                                    labelFormatter={() => 'Live'}
                                />
                                <Legend />
                                {Object.entries(resourceConfig).map(([key, { name, color }]) => (
                                    <Area key={key} type="monotone" dataKey={key} name={name} stroke={color} fill={`url(#${key}ColorHost)`} strokeWidth={2} dot={false}/>
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Modal>
    );
}