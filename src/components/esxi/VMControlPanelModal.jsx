
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCw, Monitor, Cpu, MemoryStick, HardDrive, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from "sonner";
import { motion } from "framer-motion";

const generateLiveData = (base) => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        usage: Math.max(5, base + Math.floor(Math.random() * 20) - 10)
    }));
};

export default function VMControlPanelModal({ isOpen, onClose, vm }) {
    const [cpuData, setCpuData] = useState([]);
    const [memData, setMemData] = useState([]);

    useEffect(() => {
        if (isOpen && vm) {
            // Initialize data
            setCpuData(generateLiveData(vm.status === 'running' ? 40 : 0));
            setMemData(generateLiveData(vm.status === 'running' ? 60 : 0));
            
            const interval = setInterval(() => {
                const updateData = (data, baseUsage) => {
                    const lastPoint = data[data.length - 1];
                    if (!lastPoint) return data; // Guard against empty data
                    
                    const nextTime = lastPoint.time + 1;
                    const nextUsage = vm.status === 'running'
                        ? Math.max(5, (lastPoint.usage || baseUsage) + Math.floor(Math.random() * 10) - 5)
                        : 0;
                    return [...data.slice(1), { time: nextTime, usage: nextUsage }];
                };

                setCpuData(d => updateData(d, 40));
                setMemData(d => updateData(d, 60));
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isOpen, vm]);

    if (!vm) return null;

    const isRunning = vm.status === 'running';

    const footer = (
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </>
    );

    const getStatusColor = (status) => {
        const colors = {
          running: "text-emerald-400 bg-emerald-400/20",
          stopped: "text-red-400 bg-red-400/20",
          paused: "text-yellow-400 bg-yellow-400/20"
        };
        return colors[status] || colors.stopped;
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={vm.name}
            description="Manage and monitor the virtual machine."
            size="lg"
            footer={footer}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Power Controls */}
                <div className="md:col-span-1 space-y-3 flex flex-col">
                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button disabled={isRunning} onClick={() => toast.success(`Starting ${vm.name}`)} className="w-full justify-start text-lg py-6 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 disabled:opacity-50">
                            <Play className="w-5 h-5 mr-3"/> Start
                        </Button>
                    </motion.div>
                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button disabled={!isRunning} onClick={() => toast.error(`Stopping ${vm.name}`)} className="w-full justify-start text-lg py-6 bg-red-600/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 disabled:opacity-50">
                            <Square className="w-5 h-5 mr-3"/> Stop
                        </Button>
                    </motion.div>
                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button disabled={!isRunning} onClick={() => toast.warning(`Restarting ${vm.name}`)} className="w-full justify-start text-lg py-6 bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 disabled:opacity-50">
                            <RotateCw className="w-5 h-5 mr-3"/> Restart
                        </Button>
                    </motion.div>
                </div>
                
                {/* Details & Resources */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">VM Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">OS:</span> <span className="font-semibold text-gray-200">{vm.os}</span></div></div>
                            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">IP Address:</span> <span className="font-semibold text-gray-200">{vm.ip}</span></div></div>
                            <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-400" /> <div><span className="text-gray-400">vCPUs:</span> <span className="font-semibold text-gray-200">{vm.cpu}</span></div></div>
                            <div className="flex items-center gap-2"><MemoryStick className="w-4 h-4 text-emerald-400" /> <div><span className="text-gray-400">Memory:</span> <span className="font-semibold text-gray-200">{vm.memory}GB</span></div></div>
                            <div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-orange-400" /> <div><span className="text-gray-400">Storage:</span> <span className="font-semibold text-gray-200">{vm.storage}GB</span></div></div>
                            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Status:</span> <Badge className={`${getStatusColor(vm.status)}`}>{vm.status}</Badge></div></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="h-28">
                             <h4 className="text-sm text-center text-gray-400 mb-2">CPU Usage (%)</h4>
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cpuData}>
                                     <defs><linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs>
                                     <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                                     <XAxis dataKey="time" hide={true} />
                                     <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} width={30} unit="%" />
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                                        itemStyle={{ color: '#3B82F6' }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, 'Usage']}
                                        labelFormatter={() => ''}
                                     />
                                     <Area type="monotone" dataKey="usage" stroke="#3B82F6" fill="url(#cpuColor)" strokeWidth={2} activeDot={{ r: 4 }} dot={false}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-28">
                            <h4 className="text-sm text-center text-gray-400 mb-2">Memory Usage (%)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={memData}>
                                     <defs><linearGradient id="memColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs>
                                     <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                                     <XAxis dataKey="time" hide={true} />
                                     <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} width={30} unit="%" />
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                                        itemStyle={{ color: '#10B981' }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, 'Usage']}
                                        labelFormatter={() => ''}
                                     />
                                     <Area type="monotone" dataKey="usage" stroke="#10B981" fill="url(#memColor)" strokeWidth={2} activeDot={{ r: 4 }} dot={false}/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
