
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, ShieldCheck, Bug, Laptop, Clock, Server, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from "sonner";

const mockEndpoints = [
    { id: 1, name: 'DESKTOP-DEV01', ip: '192.168.1.50', os: 'Windows 11', status: 'healthy', agent: 'v2.3', lastSeen: '2 min ago' },
    { id: 2, name: 'WEB-SERVER-01', ip: '10.0.0.10', os: 'Ubuntu 22.04', status: 'at_risk', agent: 'v2.2', lastSeen: '1 hour ago' },
    { id: 3, name: 'MACBOOK-PRO-CEO', ip: '192.168.1.55', os: 'macOS Sonoma', status: 'healthy', agent: 'v2.3', lastSeen: '5 min ago' },
    { id: 4, name: 'DC-01', ip: '10.0.0.5', os: 'Windows Server 2022', status: 'infected', agent: 'v2.3', lastSeen: '10 min ago' },
];

const mockThreats = [
    { id: 1, name: 'Troj/Krypt-AG', severity: 'critical', status: 'mitigated', endpoint: 'DC-01', firstSeen: '25 min ago' },
    { id: 2, name: 'Suspicious PowerShell', severity: 'high', status: 'detected', endpoint: 'WEB-SERVER-01', firstSeen: '1 hour ago' },
    { id: 3, name: 'Phishing Link Clicked', severity: 'medium', status: 'mitigated', endpoint: 'DESKTOP-DEV01', firstSeen: '3 hours ago' },
];

const threatSeverityData = [
    { name: 'Critical', count: 1, fill: '#dc2626' },
    { name: 'High', count: 5, fill: '#f97316' },
    { name: 'Medium', count: 12, fill: '#f59e0b' },
    { name: 'Low', count: 25, fill: '#3b82f6' },
];

const EndpointStatusBadge = ({ status }) => {
    const config = {
        healthy: { icon: <ShieldCheck className="h-3 w-3" />, color: 'bg-emerald-500/20 text-emerald-400', label: 'Healthy' },
        at_risk: { icon: <ShieldAlert className="h-3 w-3" />, color: 'bg-yellow-500/20 text-yellow-400', label: 'At Risk' },
        infected: { icon: <Bug className="h-3 w-3" />, color: 'bg-red-500/20 text-red-400', label: 'Infected' },
    };
    const current = config[status] || { icon: null, color: 'bg-gray-500/20 text-gray-400', label: 'Unknown' };
    return <Badge className={`${current.color} flex items-center gap-1 w-24 justify-center`}>{current.icon}{current.label}</Badge>;
};

export default function EDRPage() {
    const handleThreatAction = (action, threatName) => {
        toast.info(`${action} threat: ${threatName}`);
    };
    
    const handleEndpointAction = (action, endpointName) => {
        toast.info(`${action} on endpoint: ${endpointName}`);
    };

    return (
        <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2"><ShieldAlert className="h-8 w-8" /> Endpoint Detection & Response</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Endpoints</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-gray-100">{mockEndpoints.length}</div><p className="text-xs text-gray-500">Total protected devices</p></CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Infected</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-400">{mockEndpoints.filter(e=>e.status==='infected').length}</div><p className="text-xs text-gray-500">Active threats</p></CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">At Risk</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-yellow-400">{mockEndpoints.filter(e=>e.status==='at_risk').length}</div><p className="text-xs text-gray-500">Require attention</p></CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Healthy</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-emerald-400">{mockEndpoints.filter(e=>e.status==='healthy').length}</div><p className="text-xs text-gray-500">No issues</p></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="bg-gray-800 border-gray-700">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                    <TabsTrigger value="threats">Threats</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader><CardTitle>Threats by Severity</CardTitle></CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={threatSeverityData}>
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                                    <Bar dataKey="count" fill="fill" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="endpoints" className="mt-4">
                     <Card className="bg-gray-800 border-gray-700">
                        <CardHeader><CardTitle>Endpoints</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead><TableHead>OS</TableHead><TableHead>IP Address</TableHead>
                                        <TableHead>Status</TableHead><TableHead>Agent</TableHead><TableHead>Last Seen</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockEndpoints.map(ep => (
                                        <TableRow key={ep.id}>
                                            <TableCell className="font-medium text-gray-200">{ep.name}</TableCell>
                                            <TableCell>{ep.os}</TableCell><TableCell>{ep.ip}</TableCell>
                                            <TableCell><EndpointStatusBadge status={ep.status} /></TableCell>
                                            <TableCell>{ep.agent}</TableCell><TableCell>{ep.lastSeen}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEndpointAction('Isolating', ep.name)}>Isolate</Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEndpointAction('Running scan on', ep.name)}>Scan</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="threats" className="mt-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader><CardTitle>Active & Recent Threats</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Threat</TableHead><TableHead>Severity</TableHead><TableHead>Status</TableHead>
                                        <TableHead>Endpoint</TableHead><TableHead>First Seen</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockThreats.map(threat => (
                                        <TableRow key={threat.id}>
                                            <TableCell className="font-medium text-gray-200">{threat.name}</TableCell>
                                            <TableCell><Badge variant={threat.severity === 'critical' ? 'destructive' : 'secondary'} className={threat.severity === 'high' ? 'bg-orange-500' : ''}>{threat.severity}</Badge></TableCell>
                                            <TableCell>{threat.status}</TableCell><TableCell>{threat.endpoint}</TableCell>
                                            <TableCell>{threat.firstSeen}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleThreatAction('Mitigating', threat.name)}>Mitigate</Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleThreatAction('Marking as false positive', threat.name)}>Whitelist</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
