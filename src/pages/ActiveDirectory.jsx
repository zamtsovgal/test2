
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users as UsersIcon, Computer, Users, KeyRound, UserPlus, UserX, CheckCircle, AlertTriangle, Cloud, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import UserManagementModal from "../components/activedirectory/UserManagementModal";
import { ProviderIcon } from "../components/shared/ProviderIcons";

const directoryServices = [
    {
        id: 'ad-local',
        name: 'Local Active Directory',
        type: 'active-directory',
        logoName: 'microsoft',
        status: 'connected',
        host: 'dc01.local.domain',
        users: 147,
        groups: 24,
        computers: 89
    },
    {
        id: 'azure-ad',
        name: 'Azure Active Directory',
        type: 'azure-ad',
        logoName: 'azure active directory', // Changed to be more specific
        status: 'connected',
        host: 'tenant.onmicrosoft.com',
        users: 234,
        groups: 18,
        computers: 156
    },
    {
        id: 'google-workspace',
        name: 'Google Workspace',
        type: 'google-workspace',
        logoName: 'google',
        status: 'connected',
        host: 'company.com',
        users: 156,
        groups: 12,
        computers: 0
    },
    {
        id: 'ldap-main',
        name: 'LDAP Directory',
        type: 'ldap',
        logoName: 'ldap',
        status: 'warning',
        host: 'ldap.company.com',
        users: 89,
        groups: 12,
        computers: 45
    },
    {
        id: 'okta',
        name: 'Okta Identity Cloud',
        type: 'okta',
        logoName: 'okta', // Keep as a fallback
        customIconUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b1f22f09adbcb52b0d8f0f/01fc85889_Okta_logo_2023svg.png',
        status: 'connected',
        host: 'dev-123456.okta.com',
        users: 178,
        groups: 15,
        computers: 0
    }
];

const mockUsers = [
    { id: 1, name: 'administrator', givenName: 'Admin', sn: 'User', enabled: true, lastLogon: '2 hours ago', service: 'ad-local' },
    { id: 2, name: 'jdoe', givenName: 'John', sn: 'Doe', enabled: true, lastLogon: '5 days ago', service: 'ad-local' },
    { id: 3, name: 's.smith', givenName: 'Sarah', sn: 'Smith', enabled: false, lastLogon: '3 months ago', service: 'azure-ad' },
    { id: 4, name: 'testuser', givenName: 'Test', sn: 'Account', enabled: true, lastLogon: '15 minutes ago', service: 'ldap-main' },
    { id: 5, name: 'jane.wilson', givenName: 'Jane', sn: 'Wilson', enabled: true, lastLogon: '1 hour ago', service: 'okta' },
    { id: 6, name: 'mike.jones', givenName: 'Mike', sn: 'Jones', enabled: true, lastLogon: '30 minutes ago', service: 'google-workspace' },
];

const mockComputers = [
    { id: 1, name: 'DC-01', os: 'Windows Server 2022', enabled: true, lastLogon: '1 minute ago', service: 'ad-local' },
    { id: 2, name: 'FS-01', os: 'Windows Server 2019', enabled: true, lastLogon: '1 hour ago', service: 'ad-local' },
    { id: 3, name: 'DESKTOP-HR01', os: 'Windows 11', enabled: true, lastLogon: '20 minutes ago', service: 'azure-ad' },
    { id: 4, name: 'OLD-XP-MACHINE', os: 'Windows XP', enabled: false, lastLogon: '5 years ago', service: 'ad-local' },
    { id: 5, name: 'LINUX-DEV01', os: 'Ubuntu 22.04', enabled: true, lastLogon: '30 minutes ago', service: 'ldap-main' },
];

const mockGroups = [
    { id: 1, name: 'Domain Admins', members: 1, description: 'Designated administrators of the domain', service: 'ad-local' },
    { id: 2, name: 'Finance', members: 5, description: 'Members of the finance department', service: 'ad-local' },
    { id: 3, name: 'Marketing', members: 8, description: 'Members of the marketing department', service: 'azure-ad' },
    { id: 4, name: 'All Employees', members: 52, description: 'All full-time employees', service: 'azure-ad' },
    { id: 5, name: 'Developers', members: 12, description: 'Development team members', service: 'ldap-main' },
];

export default function ActiveDirectoryPage() {
    const [selectedService, setSelectedService] = useState('all');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const handleUserAction = (action, userName) => {
        toast.info(`${action} for user: ${userName}`);
    };

    const handleUserClick = (user) => {
        const userService = directoryServices.find(s => s.id === user.service);
        setSelectedUser({
            ...user, 
            serviceName: userService?.logoName, // Use logoName for proper icon mapping
            serviceCustomIconUrl: userService?.customIconUrl, // Pass custom URL to modal
            serviceDisplayName: userService?.name,
            serviceType: userService?.type
        });
        setIsUserModalOpen(true);
    };

    const getServiceIcon = (service) => {
        return <ProviderIcon name={service.logoName} className="w-6 h-6" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            connected: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
            warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
            error: "text-red-400 bg-red-400/20 border-red-400/30",
            disconnected: "text-gray-400 bg-gray-400/20 border-gray-400/30"
        };
        return colors[status] || colors.disconnected;
    };

    const filteredUsers = selectedService === 'all' ? mockUsers : mockUsers.filter(user => user.service === selectedService);
    const filteredComputers = selectedService === 'all' ? mockComputers : mockComputers.filter(comp => comp.service === selectedService);
    const filteredGroups = selectedService === 'all' ? mockGroups : mockGroups.filter(group => group.service === selectedService);

    const currentService = directoryServices.find(s => s.id === selectedService);

    return (
        <>
            <UserManagementModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                user={selectedUser}
            />
            <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
                            <UsersIcon className="h-8 w-8" /> 
                            Directory Services
                        </h1>
                        <p className="text-gray-400 mt-2">Manage users, groups, and computers across all directory services</p>
                    </div>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-gray-100">
                            <SelectValue placeholder="Select Directory Service" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="all">All Services</SelectItem>
                            {directoryServices.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                    <div className="flex items-center gap-2">
                                        <ProviderIcon name={service.logoName} customUrl={service.customIconUrl} className="w-4 h-4" />
                                        {service.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Directory Services Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {directoryServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedService(service.id)}
                            className={`cursor-pointer transition-all duration-300 ${
                                selectedService === service.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                        >
                            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 h-full">
                                <CardHeader className="pb-2 px-3 py-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between min-h-[32px]">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <div className="w-6 h-6 flex-shrink-0">
                                                    <ProviderIcon name={service.logoName} customUrl={service.customIconUrl} className="w-6 h-6" />
                                                </div>
                                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-100 truncate leading-tight">{service.name}</CardTitle>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500 truncate flex-1 mr-2">{service.host}</p>
                                            <Badge className={`${getStatusColor(service.status)} border text-xs flex-shrink-0 px-2 py-1`}>
                                                {service.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {service.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                                <span className="hidden sm:inline">{service.status}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 px-3 pb-3">
                                    <div className="grid grid-cols-3 gap-1 text-xs">
                                        <div className="text-center p-1.5 bg-gray-700/50 rounded">
                                            <div className="text-gray-400 text-xs">Users</div>
                                            <div className="font-semibold text-blue-400 text-sm">{service.users}</div>
                                        </div>
                                        <div className="text-center p-1.5 bg-gray-700/50 rounded">
                                            <div className="text-gray-400 text-xs">Groups</div>
                                            <div className="font-semibold text-emerald-400 text-sm">{service.groups}</div>
                                        </div>
                                        <div className="text-center p-1.5 bg-gray-700/50 rounded">
                                            <div className="text-gray-400 text-xs">PCs</div>
                                            <div className="font-semibold text-purple-400 text-sm">{service.computers}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Stats for Selected Service */}
                {currentService && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-gray-400">Service Health</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    {currentService.status === 'connected' ? 
                                        <CheckCircle className="h-6 w-6 text-emerald-400"/> : 
                                        <AlertTriangle className="h-6 w-6 text-yellow-400"/>
                                    }
                                    <div className="text-2xl font-bold text-gray-100 capitalize">{currentService.status}</div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Host: {currentService.host}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-gray-400">Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-100">{filteredUsers.length}</div>
                                <p className="text-xs text-gray-500">User accounts in {currentService.name}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-gray-400">Computers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-100">{filteredComputers.length}</div>
                                <p className="text-xs text-gray-500">Managed devices</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="users">
                    <TabsList className="bg-gray-800 border-gray-700">
                        <TabsTrigger value="users"><Users className="h-4 w-4 mr-2"/>Users</TabsTrigger>
                        <TabsTrigger value="groups"><UsersIcon className="h-4 w-4 mr-2"/>Groups</TabsTrigger>
                        <TabsTrigger value="computers"><Computer className="h-4 w-4 mr-2"/>Computers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="mt-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>
                                    {selectedService === 'all' ? 'All Directory Users' : `${currentService?.name} Users`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Full Name</TableHead>
                                            {selectedService === 'all' && <TableHead>Service</TableHead>}
                                            <TableHead>Last Logon</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map(user => {
                                            const userService = directoryServices.find(s => s.id === user.service);
                                            return (
                                                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-700/50" onClick={() => handleUserClick(user)}>
                                                    <TableCell>
                                                        <Badge variant={user.enabled ? 'outline' : 'destructive'} className={user.enabled ? 'border-emerald-500/50 text-emerald-400' : ''}>
                                                            {user.enabled ? 'Enabled' : 'Disabled'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-200">{user.name}</TableCell>
                                                    <TableCell>{user.givenName} {user.sn}</TableCell>
                                                    {selectedService === 'all' && (
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <ProviderIcon name={userService?.logoName} customUrl={userService?.customIconUrl} className="w-4 h-4" />
                                                                <span className="text-xs text-gray-400">{userService?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{user.lastLogon}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleUserAction('Reset Password', user.name); }}>
                                                            <KeyRound className="h-4 w-4 mr-1"/>
                                                            Reset Pwd
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleUserAction(user.enabled ? 'Disable Account' : 'Enable Account', user.name); }}>
                                                            {user.enabled ? <UserX className="h-4 w-4 mr-1 text-red-400"/> : <UserPlus className="h-4 w-4 mr-1 text-emerald-400"/>}
                                                            {user.enabled ? 'Disable' : 'Enable'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="groups" className="mt-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>
                                    {selectedService === 'all' ? 'All Directory Groups' : `${currentService?.name} Groups`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Group Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            {selectedService === 'all' && <TableHead>Service</TableHead>}
                                            <TableHead>Members</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredGroups.map(group => {
                                            const groupService = directoryServices.find(s => s.id === group.service);
                                            return (
                                                <TableRow key={group.id}>
                                                    <TableCell className="font-medium text-gray-200">{group.name}</TableCell>
                                                    <TableCell>{group.description}</TableCell>
                                                    {selectedService === 'all' && (
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <ProviderIcon name={groupService?.logoName} customUrl={groupService?.customIconUrl} className="w-4 h-4" />
                                                                <span className="text-xs text-gray-400">{groupService?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{group.members}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="computers" className="mt-4">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>
                                    {selectedService === 'all' ? 'All Managed Computers' : `${currentService?.name} Computers`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Operating System</TableHead>
                                            {selectedService === 'all' && <TableHead>Service</TableHead>}
                                            <TableHead>Last Logon</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredComputers.map(comp => {
                                            const compService = directoryServices.find(s => s.id === comp.service);
                                            return (
                                                <TableRow key={comp.id}>
                                                    <TableCell>
                                                        <Badge variant={comp.enabled ? 'outline' : 'destructive'} className={comp.enabled ? 'border-emerald-500/50 text-emerald-400' : ''}>
                                                            {comp.enabled ? 'Enabled' : 'Disabled'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-200">{comp.name}</TableCell>
                                                    <TableCell>{comp.os}</TableCell>
                                                    {selectedService === 'all' && (
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <ProviderIcon name={compService?.logoName} customUrl={compService?.customIconUrl} className="w-4 h-4" />
                                                                <span className="text-xs text-gray-400">{compService?.name}</span>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{comp.lastLogon}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
