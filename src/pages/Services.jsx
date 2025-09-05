
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, PlayCircle, StopCircle, RefreshCw, Bell, BellOff, Plus } from 'lucide-react';
import { toast } from "sonner";
import ServiceControlPanelModal from "../components/services/ServiceControlPanelModal";
import AddServiceModal from "../components/services/AddServiceModal";

const mockServices = [
    { id: 1, name: 'nginx', description: 'High performance web server', status: 'running', host: 'WEB-SERVER-01', type: 'linux', alert: true },
    { id: 2, name: 'sshd', description: 'OpenSSH server daemon', status: 'running', host: 'WEB-SERVER-01', type: 'linux', alert: false },
    { id: 3, name: 'docker', description: 'Docker Application Container Engine', status: 'running', host: 'DOCKER-HOST-01', type: 'docker', alert: true },
    { id: 4, name: 'Portainer', description: 'Portainer UI', status: 'running', host: 'DOCKER-HOST-01', type: 'docker', alert: true },
    { id: 5, name: 'smb', description: 'Samba SMB daemon', status: 'stopped', host: 'NAS-STORAGE', type: 'nas', alert: true },
    { id: 6, name: 'spoolsv', description: 'Print Spooler', status: 'running', host: 'DC-01', type: 'windows', alert: false },
    { id: 7, name: 'wuauserv', description: 'Windows Update', status: 'stopped', host: 'DC-01', type: 'windows', alert: false },
];

const StatusBadge = ({ status }) => {
    const isRunning = status === 'running';
    return (
        <Badge className={isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
            <div className={`h-2 w-2 rounded-full mr-2 ${isRunning ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            {isRunning ? 'Running' : 'Stopped'}
        </Badge>
    );
};

const TypeBadge = ({ type }) => {
    const colors = {
        linux: 'bg-yellow-500/20 text-yellow-400',
        windows: 'bg-blue-500/20 text-blue-400',
        docker: 'bg-cyan-500/20 text-cyan-400',
        nas: 'bg-purple-500/20 text-purple-400'
    };
    return <Badge className={colors[type] || 'bg-gray-500/20 text-gray-400'} >{type}</Badge>;
}

export default function ServicesPage() {
    const [services, setServices] = useState(mockServices);
    const [selectedHost, setSelectedHost] = useState('all');
    const [isServicePanelOpen, setIsServicePanelOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

    const toggleAlert = (id) => {
        // Find the service *before* updating its state to get the correct 'alert' status for the toast message
        const serviceToToggle = services.find(s => s.id === id);
        if (serviceToToggle) {
            setServices(services.map(s => s.id === id ? { ...s, alert: !s.alert } : s));
            toast.success(`Alerts for ${serviceToToggle.name} ${!serviceToToggle.alert ? 'enabled' : 'disabled'}.`);
        }
    };

    const handleAction = (action, serviceName) => {
        toast.info(`${action} service: ${serviceName}`);
    }

    const handleServiceClick = (service) => {
        setSelectedService(service);
        setIsServicePanelOpen(true);
    };

    const handleAddServices = (newServices) => {
        const maxId = services.length > 0 ? Math.max(...services.map(s => s.id)) : 0;
        const servicesWithIds = newServices.map((service, index) => ({
            ...service,
            id: maxId + index + 1
        }));
        setServices(prev => [...prev, ...servicesWithIds]);
        toast.success(`${newServices.length} service(s) added successfully!`);
    };

    const filteredServices = services.filter(s => selectedHost === 'all' || s.host === selectedHost);

    return (
        <>
            <ServiceControlPanelModal
                isOpen={isServicePanelOpen}
                onClose={() => setIsServicePanelOpen(false)}
                service={selectedService}
                onAction={handleAction}
                onToggleAlert={toggleAlert}
            />
            <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                onAddServices={handleAddServices}
            />
            <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
                    <ListChecks className="h-8 w-8" />
                    Services Inspector
                </h1>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Monitored Services</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select value={selectedHost} onValueChange={setSelectedHost}>
                                    <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
                                        <SelectValue placeholder="Filter by host..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Hosts</SelectItem>
                                        {[...new Set(services.map(s => s.host))].map(host => (
                                            <SelectItem key={host} value={host}>{host}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => setIsAddServiceModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Services
                                </Button>
                                <Button variant="outline" className="border-gray-600" onClick={() => toast.info('Refreshing service list...')}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Host</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.map(service => (
                                    <TableRow key={service.id} className="cursor-pointer hover:bg-gray-700/50" onClick={() => handleServiceClick(service)}>
                                        <TableCell><StatusBadge status={service.status} /></TableCell>
                                        <TableCell className="font-medium text-gray-200">{service.name}</TableCell>
                                        <TableCell className="text-gray-400">{service.description}</TableCell>
                                        <TableCell>{service.host}</TableCell>
                                        <TableCell><TypeBadge type={service.type} /></TableCell>
                                        <TableCell className="flex justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button size="icon" variant="ghost" className="hover:bg-emerald-500/10 text-emerald-400" onClick={() => handleAction('Starting', service.name)}><PlayCircle className="h-5 w-5"/></Button>
                                            <Button size="icon" variant="ghost" className="hover:bg-red-500/10 text-red-400" onClick={() => handleAction('Stopping', service.name)}><StopCircle className="h-5 w-5"/></Button>
                                            <Button size="icon" variant="ghost" className="hover:bg-blue-500/10 text-blue-400" onClick={() => handleAction('Restarting', service.name)}><RefreshCw className="h-5 w-5"/></Button>
                                            <Button size="icon" variant="ghost" onClick={() => toggleAlert(service.id)} className={`hover:bg-yellow-500/10 ${service.alert ? 'text-yellow-400' : 'text-gray-500'}`}>
                                                {service.alert ? <Bell className="h-5 w-5"/> : <BellOff className="h-5 w-5"/>}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
