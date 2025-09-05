import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Activity, Container, HardDrive, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const generateMetricData = (metricType, itemName) => {
    const baseValues = {
        servers: { cpu: 45, memory: 65, network: 25 },
        vms: { cpu: 70, memory: 80, network: 35 },
        containers: { cpu: 15, memory: 25, network: 45 },
        storage: { usage: 75, iops: 150, throughput: 25 }
    };

    const base = baseValues[metricType] || baseValues.servers;
    
    return Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value1: Math.max(5, base.cpu + Math.floor(Math.random() * 30) - 15),
        value2: Math.max(10, base.memory + Math.floor(Math.random() * 20) - 10),
        value3: Math.max(5, base.network + Math.floor(Math.random() * 25) - 12)
    }));
};

const metricConfigs = {
    servers: {
        title: 'Server Infrastructure',
        items: [
            { name: 'ESXi-HOST-01', status: 'online', type: 'esxi', icon: Server },
            { name: 'ESXi-HOST-02', status: 'online', type: 'esxi', icon: Server },
            { name: 'vCenter-Server', status: 'online', type: 'vcenter', icon: Server },
            { name: 'NAS-Storage', status: 'warning', type: 'nas', icon: HardDrive },
            { name: 'Docker-Host', status: 'online', type: 'docker', icon: Container }
        ],
        chartLabels: ['CPU %', 'Memory %', 'Network MB/s']
    },
    vms: {
        title: 'Virtual Machines',
        items: [
            { name: 'Web-Server-VM', status: 'online', type: 'vm', icon: Activity, host: 'ESXi-HOST-01' },
            { name: 'DB-Server-VM', status: 'online', type: 'vm', icon: Activity, host: 'ESXi-HOST-01' },
            { name: 'File-Server-VM', status: 'online', type: 'vm', icon: Activity, host: 'ESXi-HOST-02' },
            { name: 'Test-VM', status: 'offline', type: 'vm', icon: Activity, host: 'ESXi-HOST-02' }
        ],
        chartLabels: ['CPU %', 'Memory %', 'Disk IO MB/s']
    },
    containers: {
        title: 'Docker Containers',
        items: [
            { name: 'nginx-proxy', status: 'online', type: 'container', icon: Container, image: 'nginx:latest' },
            { name: 'postgres-db', status: 'online', type: 'container', icon: Container, image: 'postgres:13' },
            { name: 'redis-cache', status: 'online', type: 'container', icon: Container, image: 'redis:alpine' },
            { name: 'monitoring-app', status: 'offline', type: 'container', icon: Container, image: 'grafana:latest' }
        ],
        chartLabels: ['CPU %', 'Memory MB', 'Network KB/s']
    },
    storage: {
        title: 'Storage Systems',
        items: [
            { name: 'DataStore-01', status: 'online', type: 'datastore', icon: HardDrive, capacity: '2TB', used: '1.2TB' },
            { name: 'DataStore-02', status: 'online', type: 'datastore', icon: HardDrive, capacity: '4TB', used: '2.8TB' },
            { name: 'NAS-Main', status: 'warning', type: 'nas', icon: HardDrive, capacity: '8TB', used: '6.1TB' },
            { name: 'Backup-Storage', status: 'online', type: 'backup', icon: HardDrive, capacity: '12TB', used: '4.5TB' }
        ],
        chartLabels: ['Usage %', 'IOPS', 'Throughput MB/s']
    }
};

export default function DashboardMetricModal({ isOpen, onClose, metricType }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [chartData, setChartData] = useState([]);

    const config = metricConfigs[metricType];
    
    React.useEffect(() => {
        if (isOpen && config) {
            const firstItem = config.items[0];
            setSelectedItem(firstItem?.name || '');
            setChartData(generateMetricData(metricType, firstItem?.name));
        }
    }, [isOpen, metricType, config]);

    React.useEffect(() => {
        if (selectedItem) {
            setChartData(generateMetricData(metricType, selectedItem));
        }
    }, [selectedItem, metricType]);

    if (!config) return null;

    const filteredItems = config.items.filter(item => 
        filterStatus === 'all' || item.status === filterStatus
    );

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={config.title}
            description={`Monitor and manage your ${metricType}`}
            size="xl"
        >
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="online">Online Only</SelectItem>
                            <SelectItem value="warning">Warning Only</SelectItem>
                            <SelectItem value="offline">Offline Only</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                        <SelectTrigger className="w-60 bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select item for metrics" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredItems.map(item => (
                                <SelectItem key={item.name} value={item.name}>
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Items List */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-200">Items Overview</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {filteredItems.map((item, index) => (
                                <Card key={index} className={`bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 transition-all cursor-pointer ${
                                    selectedItem === item.name ? 'border-blue-500 bg-blue-500/10' : ''
                                }`} onClick={() => setSelectedItem(item.name)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5 text-blue-400" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-100">{item.name}</h4>
                                                    <p className="text-xs text-gray-400">
                                                        {item.host && `Host: ${item.host}`}
                                                        {item.image && `Image: ${item.image}`}
                                                        {item.capacity && `Capacity: ${item.capacity}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={`${getStatusColor(item.status)} border`}>
                                                {getStatusIcon(item.status)}
                                                <span className="ml-1 capitalize">{item.status}</span>
                                            </Badge>
                                        </div>
                                        
                                        {metricType === 'storage' && item.used && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>Used: {item.used}</span>
                                                    <span>Total: {item.capacity}</span>
                                                </div>
                                                <Progress value={Math.floor(Math.random() * 40) + 40} className="h-2" />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                {selectedItem ? `Performance: ${selectedItem}` : 'Select an item to view metrics'}
                            </h3>
                            {selectedItem && (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="metric1" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="metric2" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="metric3" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                                            <YAxis stroke="#9CA3AF" fontSize={12} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                            
                                            <Area type="monotone" dataKey="value1" name={config.chartLabels[0]} stroke="#3B82F6" fill="url(#metric1)" strokeWidth={2} dot={false} />
                                            <Area type="monotone" dataKey="value2" name={config.chartLabels[1]} stroke="#10B981" fill="url(#metric2)" strokeWidth={2} dot={false} />
                                            <Area type="monotone" dataKey="value3" name={config.chartLabels[2]} stroke="#8B5CF6" fill="url(#metric3)" strokeWidth={2} dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats for Selected Item */}
                        {selectedItem && (
                            <div className="grid grid-cols-2 gap-3">
                                <Card className="bg-gray-700/50 border-gray-600">
                                    <CardContent className="p-3 text-center">
                                        <div className="text-xl font-bold text-blue-400">{Math.floor(Math.random() * 40) + 30}%</div>
                                        <div className="text-xs text-gray-400">{config.chartLabels[0]}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-700/50 border-gray-600">
                                    <CardContent className="p-3 text-center">
                                        <div className="text-xl font-bold text-emerald-400">{Math.floor(Math.random() * 30) + 50}%</div>
                                        <div className="text-xs text-gray-400">{config.chartLabels[1]}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}