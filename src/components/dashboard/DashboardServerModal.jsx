import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Activity, Container, HardDrive, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { toast } from "sonner";

export default function DashboardServerModal({ isOpen, onClose }) {
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const servers = [
        { id: 1, name: 'ESXi-HOST-01', type: 'esxi', status: 'online', ip: '192.168.1.100', vms: 8, cpu: 68, memory: 73 },
        { id: 2, name: 'ESXi-HOST-02', type: 'esxi', status: 'online', ip: '192.168.1.101', vms: 6, cpu: 45, memory: 62 },
        { id: 3, name: 'vCenter-Server', type: 'vcenter', status: 'online', ip: '192.168.1.102', vms: 14, cpu: 25, memory: 35 },
        { id: 4, name: 'Docker-Host', type: 'docker', status: 'online', ip: '192.168.1.103', containers: 6, cpu: 15, memory: 28 },
        { id: 5, name: 'NAS-Storage', type: 'nas', status: 'warning', ip: '192.168.1.104', storage: '85%', cpu: 12, memory: 22 }
    ];

    const filteredServers = servers.filter(server => {
        const typeMatch = filterType === 'all' || server.type === filterType;
        const statusMatch = filterStatus === 'all' || server.status === filterStatus;
        return typeMatch && statusMatch;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'online': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'offline': return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <XCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            online: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
            offline: "text-red-400 bg-red-400/20 border-red-400/30",
            warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
        };
        return colors[status] || colors.offline;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'esxi':
            case 'vcenter': return <Server className="w-5 h-5 text-blue-400" />;
            case 'docker': return <Container className="w-5 h-5 text-cyan-400" />;
            case 'nas': return <HardDrive className="w-5 h-5 text-purple-400" />;
            default: return <Server className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Server Infrastructure Overview"
            description="Monitor and manage all servers in your infrastructure"
            size="xl"
        >
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="esxi">ESXi Hosts</SelectItem>
                            <SelectItem value="vcenter">vCenter</SelectItem>
                            <SelectItem value="docker">Docker</SelectItem>
                            <SelectItem value="nas">NAS Storage</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="ml-auto text-sm text-gray-400">
                        Showing {filteredServers.length} of {servers.length} servers
                    </div>
                </div>

                {/* Servers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredServers.map((server) => (
                        <Card key={server.id} className="bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 hover:border-blue-500/50 transition-all cursor-pointer">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getTypeIcon(server.type)}
                                        <div>
                                            <CardTitle className="text-gray-100 text-base">{server.name}</CardTitle>
                                            <p className="text-xs text-gray-400">{server.ip}</p>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(server.status)} border`}>
                                        {getStatusIcon(server.status)}
                                        <span className="ml-1 capitalize">{server.status}</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                    <div className="text-center p-2 bg-gray-600/30 rounded">
                                        <div className="text-gray-400">
                                            {server.vms ? 'VMs' : server.containers ? 'Containers' : server.storage ? 'Storage' : 'Load'}
                                        </div>
                                        <div className="font-semibold text-blue-400">
                                            {server.vms || server.containers || server.storage || `${server.cpu}%`}
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-600/30 rounded">
                                        <div className="text-gray-400">CPU</div>
                                        <div className="font-semibold text-emerald-400">{server.cpu}%</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-600/30 rounded">
                                        <div className="text-gray-400">Memory</div>
                                        <div className="font-semibold text-purple-400">{server.memory}%</div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" className="flex-1 text-xs" onClick={(e) => {
                                        e.stopPropagation();
                                        toast.info(`Refreshing ${server.name}...`);
                                    }}>
                                        <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                                    </Button>
                                    <Button size="sm" variant="ghost" className="flex-1 text-xs" onClick={(e) => {
                                        e.stopPropagation();
                                        toast.info(`Opening settings for ${server.name}...`);
                                    }}>
                                        <Settings className="w-3 h-3 mr-1" /> Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Modal>
    );
}