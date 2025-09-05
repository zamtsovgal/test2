
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCw, Cpu, MemoryStick, Info, Terminal, Layers, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from "sonner";
import { motion } from "framer-motion";

const generateLiveData = (base) => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        usage: Math.max(0, base + Math.floor(Math.random() * 20) - 10)
    }));
};

const generateMockLogs = (containerName) => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages = [
        `Request to /api/v1/status completed in 25ms`,
        `User 'admin' successfully authenticated from 192.168.1.10`,
        `Connection to database 'main_db' established.`,
        `[DEPRECATED] The 'old_api' endpoint will be removed in a future version.`,
        `Failed to connect to redis cache: Connection refused.`,
        `Starting background worker for job ID: ${Math.random().toString(36).substr(2, 9)}`,
        `Worker finished job ID: ${Math.random().toString(36).substr(2, 9)}`,
        `Health check passed.`,
        `Could not find file '/app/config/optional.yml'. Skipping.`,
        `High memory pressure detected. Current usage: 85%`,
    ];

    let logOutput = [];
    for (let i = 0; i < 50; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = new Date(Date.now() - Math.random() * 1000 * 60 * 10).toISOString();
        logOutput.push(`${timestamp} [${level}] --- [${containerName}]: ${message}`);
    }
    return logOutput.join('\n');
};

export default function DockerContainerControlPanelModal({ isOpen, onClose, container, onAction }) {
    const [cpuData, setCpuData] = useState([]);
    const [memData, setMemData] = useState([]);
    const [viewMode, setViewMode] = useState('details'); // 'details' or 'logs'
    const [logs, setLogs] = useState('');

    useEffect(() => {
        if (isOpen && container) {
            setViewMode('details'); // Reset to details view on open
            setLogs(generateMockLogs(container.name));
            setCpuData(generateLiveData(container.status === 'running' ? container.cpu : 0));
            setMemData(generateLiveData(container.status === 'running' ? 5 : 0));
            
            const interval = setInterval(() => {
                const updateData = (data, baseUsage) => {
                    const lastPoint = data[data.length - 1];
                    if (!lastPoint) return data;
                    const nextTime = lastPoint.time + 1;
                    const nextUsage = container.status === 'running'
                        ? Math.max(0, (lastPoint.usage || baseUsage) + Math.floor(Math.random() * 5) - 2.5)
                        : 0;
                    return [...data.slice(1), { time: nextTime, usage: nextUsage }];
                };

                setCpuData(d => updateData(d, container.cpu || 0));
                setMemData(d => updateData(d, 5));
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isOpen, container]);

    if (!container) return null;

    const isRunning = container.status === 'running';

    const footer = (
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {viewMode === 'details' ? (
            <Button className="bg-gray-600 hover:bg-gray-500" onClick={() => setViewMode('logs')}>
                <Terminal className="w-4 h-4 mr-2" />
                View Logs
            </Button>
          ) : (
            <Button className="bg-gray-600 hover:bg-gray-500" onClick={() => setViewMode('details')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
            </Button>
          )}
        </>
    );

    const getStatusColor = (status) => {
        const colors = {
          running: "text-emerald-400 bg-emerald-400/20",
          stopped: "text-red-400 bg-red-400/20",
          paused: "text-yellow-400 bg-yellow-400/20",
          restarting: "text-blue-400 bg-blue-400/20",
        };
        return colors[status] || colors.stopped;
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={viewMode === 'details' ? container.name : `Logs: ${container.name}`}
            description={viewMode === 'details' ? "Manage and monitor the Docker container." : "Live log stream from the container."}
            size="lg"
            footer={footer}
        >
            {viewMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Power Controls */}
                    <div className="md:col-span-1 space-y-3 flex flex-col">
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={isRunning} onClick={() => onAction(container.id, 'start')} className="w-full justify-start text-lg py-6 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 disabled:opacity-50">
                                <Play className="w-5 h-5 mr-3"/> Start
                            </Button>
                        </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={!isRunning} onClick={() => onAction(container.id, 'stop')} className="w-full justify-start text-lg py-6 bg-red-600/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 disabled:opacity-50">
                                <Square className="w-5 h-5 mr-3"/> Stop
                            </Button>
                        </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={!isRunning} onClick={() => onAction(container.id, 'restart')} className="w-full justify-start text-lg py-6 bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 disabled:opacity-50">
                                <RotateCw className="w-5 h-5 mr-3"/> Restart
                            </Button>
                        </motion.div>
                    </div>
                    
                    {/* Details & Resources */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Container Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> <div><span className="text-gray-400">Image:</span> <span className="font-semibold text-gray-200">{container.image}</span></div></div>
                                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Status:</span> <Badge className={`${getStatusColor(container.status)}`}>{container.status}</Badge></div></div>
                                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Ports:</span> <span className="font-semibold text-gray-200">{container.ports}</span></div></div>
                                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Network:</span> <span className="font-semibold text-gray-200">{container.network}</span></div></div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="h-28">
                                 <h4 className="text-sm text-center text-gray-400 mb-2">CPU Usage (%)</h4>
                                 <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cpuData}>
                                         <defs><linearGradient id="cpuColorDocker" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs>
                                         <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                                         <XAxis dataKey="time" hide={true} />
                                         <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} width={30} unit="%" />
                                         <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} itemStyle={{ color: '#3B82F6' }} formatter={(v)=>[`${v.toFixed(1)}%`, 'Usage']}/>
                                         <Area type="monotone" dataKey="usage" stroke="#3B82F6" fill="url(#cpuColorDocker)" strokeWidth={2} dot={false}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="h-28">
                                <h4 className="text-sm text-center text-gray-400 mb-2">Memory Usage (MB)</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={memData}>
                                         <defs><linearGradient id="memColorDocker" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs>
                                         <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                                         <XAxis dataKey="time" hide={true} />
                                         <YAxis stroke="#9CA3AF" fontSize={10} width={30} unit="MB" />
                                         <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} itemStyle={{ color: '#10B981' }} formatter={(v)=>[`${v.toFixed(1)}MB`, 'Usage']}/>
                                         <Area type="monotone" dataKey="usage" stroke="#10B981" fill="url(#memColorDocker)" strokeWidth={2} dot={false}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-96 bg-black rounded-lg p-4 font-mono text-xs text-gray-300 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <pre>{logs}</pre>
                </div>
            )}
        </Modal>
    );
}
