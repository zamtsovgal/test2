import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCw, Settings, Terminal, Info, Server, Activity, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";

const generateMockLogs = (serviceName) => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages = [
        `Service ${serviceName} started successfully`,
        `Configuration file loaded from /etc/${serviceName}/${serviceName}.conf`,
        `Listening on port 80 for incoming connections`,
        `Worker process spawned with PID 1234`,
        `Health check passed - service responding normally`,
        `Received SIGHUP - reloading configuration`,
        `Connection established from 192.168.1.10`,
        `Request processed in 15ms`,
        `Memory usage: 45MB (within normal limits)`,
        `Backup operation completed successfully`,
    ];

    let logOutput = [];
    for (let i = 0; i < 30; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = new Date(Date.now() - Math.random() * 1000 * 60 * 60).toISOString();
        logOutput.push(`${timestamp} [${level}] ${serviceName}: ${message}`);
    }
    return logOutput.join('\n');
};

export default function ServiceControlPanelModal({ isOpen, onClose, service }) {
    const [viewMode, setViewMode] = useState('details'); // 'details' or 'logs'
    const [logs, setLogs] = useState('');

    React.useEffect(() => {
        if (isOpen && service) {
            setViewMode('details');
            setLogs(generateMockLogs(service.name));
        }
    }, [isOpen, service]);

    if (!service) return null;

    const isRunning = service.status === 'running';

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
          error: "text-red-400 bg-red-400/20",
        };
        return colors[status] || colors.stopped;
    };

    const getTypeIcon = (type) => {
        const icons = {
            linux: '🐧',
            windows: '🪟',
            docker: '🐳',
            nas: '💾'
        };
        return icons[type] || '⚙️';
    };

    const handleAction = (action) => {
        toast.info(`${action} service: ${service.name}`);
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={viewMode === 'details' ? `Service: ${service.name}` : `Logs: ${service.name}`}
            description={viewMode === 'details' ? "Manage and monitor the service." : "Live log stream from the service."}
            size="lg"
            footer={footer}
        >
            {viewMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Service Controls */}
                    <div className="md:col-span-1 space-y-3 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-2">Service Actions</h3>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={isRunning} onClick={() => handleAction('Starting')} className="w-full justify-start text-lg py-6 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 disabled:opacity-50">
                                <Play className="w-5 h-5 mr-3"/> Start
                            </Button>
                        </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={!isRunning} onClick={() => handleAction('Stopping')} className="w-full justify-start text-lg py-6 bg-red-600/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 disabled:opacity-50">
                                <Square className="w-5 h-5 mr-3"/> Stop
                            </Button>
                        </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button disabled={!isRunning} onClick={() => handleAction('Restarting')} className="w-full justify-start text-lg py-6 bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 disabled:opacity-50">
                                <RotateCw className="w-5 h-5 mr-3"/> Restart
                            </Button>
                        </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button onClick={() => handleAction('Configuring')} className="w-full justify-start text-lg py-6 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300">
                                <Settings className="w-5 h-5 mr-3"/> Configure
                            </Button>
                        </motion.div>
                    </div>
                    
                    {/* Details & Information */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Service Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{getTypeIcon(service.type)}</span>
                                    <div><span className="text-gray-400">Service:</span> <span className="font-semibold text-gray-200">{service.name}</span></div>
                                </div>
                                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Status:</span> <Badge className={`${getStatusColor(service.status)}`}>{service.status}</Badge></div></div>
                                <div className="flex items-center gap-2"><Server className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Host:</span> <span className="font-semibold text-gray-200">{service.host}</span></div></div>
                                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> <div><span className="text-gray-400">Type:</span> <span className="font-semibold text-gray-200">{service.type}</span></div></div>
                                <div className="col-span-2 flex items-start gap-2"><Info className="w-4 h-4 text-gray-400 mt-0.5" /> <div><span className="text-gray-400">Description:</span> <span className="font-semibold text-gray-200">{service.description}</span></div></div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-700/30 border border-gray-600/50 rounded-lg">
                            <h4 className="text-md font-semibold text-gray-200 mb-3">Service Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-400">Process ID:</span> <span className="font-mono text-green-400">{isRunning ? Math.floor(Math.random() * 9000) + 1000 : 'N/A'}</span></div>
                                <div><span className="text-gray-400">Memory Usage:</span> <span className="font-mono text-emerald-400">{isRunning ? `${Math.floor(Math.random() * 200) + 50}MB` : 'N/A'}</span></div>
                                <div><span className="text-gray-400">Start Time:</span> <span className="font-mono text-blue-400">{isRunning ? new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toLocaleString() : 'N/A'}</span></div>
                                <div><span className="text-gray-400">Alerts:</span> <span className={`font-mono ${service.alert ? 'text-yellow-400' : 'text-gray-400'}`}>{service.alert ? 'Enabled' : 'Disabled'}</span></div>
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