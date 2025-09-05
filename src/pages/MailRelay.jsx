
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Mail,
  Shield,
  AlertTriangle,
  Eye,
  Trash2,
  ArrowRight,
  Lock,
  Unlock,
  Bug,
  FileX,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Filter,
  Plus,
  Cloud,
  Server as ServerIcon
} from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ProviderIcon } from '../components/shared/ProviderIcons';
import AddProviderModal from '../components/mail_security/AddProviderModal';
import ViewEmailModal from '../components/mail_security/ViewEmailModal';
import ProviderSettingsModal from '../components/mail_security/ProviderSettingsModal';

const mockMailProviders = [
    {
        id: 1,
        name: 'Google Workspace',
        description: 'Gmail SMTP Relay',
        status: 'connected',
        type: 'cloud',
        icon: 'gmail',
        throughput: '150 emails/min',
        settings: {
            smtpHost: 'smtp-relay.gmail.com',
            smtpPort: 587,
            securityProtocol: 'TLS',
            username: 'user@company.com',
            apiKey: '********'
        }
    },
    {
        id: 2,
        name: 'Microsoft 365',
        description: 'Exchange Online SMTP',
        status: 'connected',
        type: 'cloud',
        icon: 'microsoft-365',
        throughput: '180 emails/min',
        settings: {
            smtpHost: 'smtp.office365.com',
            smtpPort: 587,
            securityProtocol: 'STARTTLS',
            username: 'user@company.onmicrosoft.com',
            apiKey: '********'
        }
    },
    {
        id: 3,
        name: 'Amazon SES',
        description: 'Simple Email Service',
        status: 'disconnected',
        type: 'cloud',
        icon: 'aws',
        throughput: '0 emails/min',
        settings: {
            smtpHost: 'email-smtp.us-east-1.amazonaws.com',
            smtpPort: 587,
            securityProtocol: 'TLS',
            accessKeyId: 'AKIA**********',
            secretAccessKey: '********'
        }
    },
    {
        id: 4,
        name: 'Local Postfix',
        description: '192.168.1.20:587',
        status: 'error',
        type: 'local',
        icon: 'postfix',
        error: 'Connection timeout',
        throughput: '120 emails/min',
        settings: {
            smtpHost: '192.168.1.20',
            smtpPort: 587,
            securityProtocol: 'None',
            username: 'admin',
            password: '********'
        }
    }
];

const mockQuarantinedEmails = [
    { id: 1, timestamp: '2023-10-27 11:15:32', from: 'suspicious@fake-bank.com', to: 'user@company.com', subject: 'Urgent: Verify Your Account', threat: 'Phishing', severity: 'high', status: 'quarantined' },
    { id: 2, timestamp: '2023-10-27 11:05:15', from: 'invoice@malicious.net', to: 'accounting@company.com', subject: 'Invoice #12345.exe', threat: 'Malware', severity: 'critical', status: 'quarantined' },
    { id: 3, timestamp: '2023-10-27 10:55:49', from: 'noreply@legit-looking.com', to: 'hr@company.com', subject: 'Job Application Resume.pdf.exe', threat: 'Trojan', severity: 'critical', status: 'quarantined' },
    { id: 4, timestamp: '2023-10-27 10:45:21', from: 'admin@suspicious-domain.ru', to: 'admin@company.com', subject: 'System Alert: Security Breach', threat: 'Spam', severity: 'medium', status: 'quarantined' },
    { id: 5, timestamp: '2023-10-27 10:35:18', from: 'support@fake-microsoft.com', to: 'it@company.com', subject: 'Microsoft Security Alert', threat: 'Phishing', severity: 'high', status: 'released' },
];

const mockMailFlow = [
    { step: 1, name: 'Incoming Mail', status: 'active', processed: 2456, icon: Mail, color: 'text-blue-400' },
    { step: 2, name: 'Anti-Virus Scan', status: 'active', processed: 2456, blocked: 12, icon: Shield, color: 'text-emerald-400' },
    { step: 3, name: 'Malware Detection', status: 'active', processed: 2444, blocked: 8, icon: Bug, color: 'text-red-400' },
    { step: 4, name: 'Phishing Protection', status: 'active', processed: 2436, blocked: 15, icon: AlertTriangle, color: 'text-yellow-400' },
    { step: 5, name: 'Content Analysis', status: 'active', processed: 2421, blocked: 3, icon: Eye, color: 'text-purple-400' },
    { step: 6, name: 'Quarantine Review', status: 'active', quarantined: 38, icon: Lock, color: 'text-orange-400' },
    { step: 7, name: 'Safe Delivery', status: 'active', delivered: 2383, icon: CheckCircle, color: 'text-emerald-400' },
];

const mockThreatData = [
    { name: 'Clean', value: 2383, color: '#10B981' },
    { name: 'Phishing', value: 15, color: '#F59E0B' },
    { name: 'Malware', value: 12, color: '#EF4444' },
    { name: 'Spam', value: 23, color: '#8B5CF6' },
    { name: 'Suspicious', value: 23, color: '#F97316' },
];

const mockTrendData = [
    { time: '00:00', threats: 5, clean: 45, quarantined: 2 },
    { time: '04:00', threats: 3, clean: 23, quarantined: 1 },
    { time: '08:00', threats: 12, clean: 89, quarantined: 4 },
    { time: '12:00', threats: 18, clean: 134, quarantined: 7 },
    { time: '16:00', threats: 22, clean: 167, quarantined: 9 },
    { time: '20:00', threats: 15, clean: 98, quarantined: 6 },
];

const ProviderStatusBadge = ({ status }) => {
    switch (status) {
        case "connected":
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
        case "disconnected":
            return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30"><XCircle className="w-3 h-3 mr-1" />Disconnected</Badge>;
        case "error":
            return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

const ThreatBadge = ({ severity }) => {
    const config = {
        critical: { color: 'bg-red-500/20 text-red-400', label: 'Critical' },
        high: { color: 'bg-orange-500/20 text-orange-400', label: 'High' },
        medium: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Medium' },
        low: { color: 'bg-blue-500/20 text-blue-400', label: 'Low' },
    };
    const current = config[severity] || config.low;
    return <Badge className={`${current.color} border`}>{current.label}</Badge>;
};

const StatusBadge = ({ status }) => {
    switch (status) {
        case "quarantined":
            return <Badge className="bg-orange-500/20 text-orange-400"><Lock className="w-3 h-3 mr-1" />Quarantined</Badge>;
        case "released":
            return <Badge className="bg-emerald-500/20 text-emerald-400"><Unlock className="w-3 h-3 mr-1" />Released</Badge>;
        case "deleted":
            return <Badge className="bg-red-500/20 text-red-400"><Trash2 className="w-3 h-3 mr-1" />Deleted</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

export default function MailRelayPage() {
    const [providers, setProviders] = useState(mockMailProviders);
    const [quarantinedEmails, setQuarantinedEmails] = useState(mockQuarantinedEmails);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
    const [isViewEmailModalOpen, setIsViewEmailModalOpen] = useState(false);
    const [viewingEmail, setViewingEmail] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const handleEmailAction = (action, emailId, emailSubject) => {
        const newStatus = action === 'Releasing' ? 'released' : 'deleted';
        toast.success(`Email "${emailSubject}" ${newStatus} successfully.`);
        setQuarantinedEmails(prev => prev.map(e => e.id === emailId ? { ...e, status: newStatus } : e));
        setIsViewEmailModalOpen(false);
    };

    const handleBulkAction = (action) => {
        if (selectedEmails.length === 0) {
            toast.error('Please select emails first.');
            return;
        }
        const newStatus = action === 'Release' ? 'released' : 'deleted';
        toast.info(`${action}ing ${selectedEmails.length} selected emails...`);
        setQuarantinedEmails(prev => prev.map(email =>
            selectedEmails.includes(email.id) ? { ...email, status: newStatus } : email
        ));
        setSelectedEmails([]);
    };

    const handleSelectEmail = (emailId) => {
        setSelectedEmails(prev =>
            prev.includes(emailId)
                ? prev.filter(id => id !== emailId)
                : [...prev, emailId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmails(quarantinedEmails.filter(em => em.status === 'quarantined').map(em => em.id));
        } else {
            setSelectedEmails([]);
        }
    };

    const handleViewEmail = (email) => {
        setViewingEmail(email);
        setIsViewEmailModalOpen(true);
    };

    const handleSaveProvider = (newProvider) => {
        setProviders(prev => [newProvider, ...prev]);
        toast.success(`Provider "${newProvider.name}" added successfully.`);
    };

    const handleOpenSettings = (provider) => {
        setSelectedProvider(provider);
        setIsSettingsModalOpen(true);
    };

    const handleSaveProviderSettings = (updatedProvider) => {
        setProviders(prev => prev.map(p => p.id === updatedProvider.id ? updatedProvider : p));
        toast.success(`Provider "${updatedProvider.name}" settings updated.`);
        setIsSettingsModalOpen(false);
    };

    return (
        <>
            <AddProviderModal isOpen={isAddProviderModalOpen} onClose={() => setIsAddProviderModalOpen(false)} onSave={handleSaveProvider} />
            <ViewEmailModal
                isOpen={isViewEmailModalOpen}
                onClose={() => setIsViewEmailModalOpen(false)}
                email={viewingEmail}
                onRelease={() => viewingEmail && handleEmailAction('Releasing', viewingEmail.id, viewingEmail.subject)}
                onDelete={() => viewingEmail && handleEmailAction('Deleting', viewingEmail.id, viewingEmail.subject)}
            />
            <ProviderSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                provider={selectedProvider}
                onSave={handleSaveProviderSettings}
            />
            <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100 mb-2 flex items-center gap-3">
                            <Shield className="w-8 h-8" /> Mail Security
                        </h1>
                        <p className="text-gray-400">Manage connections, mail flow, and quarantined threats.</p>
                    </div>
                    <Button onClick={() => setIsAddProviderModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Provider
                    </Button>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-100 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Mail Providers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {providers.map((provider, index) => (
                                <motion.div
                                    key={provider.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                                    onClick={() => handleOpenSettings(provider)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <ProviderIcon name={provider.icon} className="h-8 w-8 text-gray-300" />
                                            <div>
                                                <h3 className="font-semibold text-gray-100">{provider.name}</h3>
                                                <p className="text-xs text-gray-400">{provider.description}</p>
                                            </div>
                                        </div>
                                        <ProviderStatusBadge status={provider.status} />
                                    </div>

                                    <div className="mt-3 flex justify-between items-center text-xs">
                                        <Badge variant="secondary" className="capitalize bg-gray-600 text-gray-300">
                                            {provider.type === 'cloud' ? <Cloud className="w-3 h-3 mr-1" /> : <ServerIcon className="w-3 h-3 mr-1" />}
                                            {provider.type}
                                        </Badge>
                                        <span className="text-gray-400">{provider.throughput}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Emails Scanned</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-blue-400">2,456</div><p className="text-xs text-gray-500 mt-1">Last 24 hours</p></CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Threats Blocked</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-red-400">73</div><p className="text-xs text-gray-500 mt-1">2.97% threat rate</p></CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Quarantined</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-orange-400">{quarantinedEmails.filter(e => e.status === 'quarantined').length}</div><p className="text-xs text-gray-500 mt-1">Awaiting review</p></CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Clean Delivered</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-emerald-400">2,383</div><p className="text-xs text-gray-500 mt-1">97.03% clean rate</p></CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-400">Detection Rate</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-purple-400">99.8%</div><p className="text-xs text-gray-500 mt-1">Security effectiveness</p></CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="quarantine" className="space-y-6">
                    <TabsList className="bg-gray-800 border border-gray-700">
                        <TabsTrigger value="quarantine" className="data-[state=active]:bg-blue-600">Quarantine</TabsTrigger>
                        <TabsTrigger value="flow" className="data-[state=active]:bg-blue-600">Security Flow</TabsTrigger>
                        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                        <TabsTrigger value="threats" className="data-[state=active]:bg-blue-600">Threat Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quarantine" className="space-y-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-gray-100 flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Quarantined Emails
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleBulkAction('Release')}
                                            disabled={selectedEmails.length === 0}
                                            className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                                        >
                                            <Unlock className="w-4 h-4 mr-1" />
                                            Release Selected
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleBulkAction('Delete')}
                                            disabled={selectedEmails.length === 0}
                                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete Selected
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    className="rounded"
                                                    checked={selectedEmails.length === quarantinedEmails.filter(em => em.status === 'quarantined').length && quarantinedEmails.filter(em => em.status === 'quarantined').length > 0}
                                                />
                                            </TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>From</TableHead>
                                            <TableHead>To</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Threat Type</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quarantinedEmails.map((email) => (
                                            <TableRow key={email.id}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEmails.includes(email.id)}
                                                        onChange={() => handleSelectEmail(email.id)}
                                                        disabled={email.status !== 'quarantined'}
                                                        className="rounded"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-sm">{email.timestamp}</TableCell>
                                                <TableCell className="text-gray-300 text-sm">{email.from}</TableCell>
                                                <TableCell className="text-gray-300 text-sm">{email.to}</TableCell>
                                                <TableCell className="text-gray-300 text-sm max-w-xs truncate">{email.subject}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        email.threat === 'Malware' || email.threat === 'Trojan' ? 'bg-red-500/20 text-red-400' :
                                                        email.threat === 'Phishing' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-purple-500/20 text-purple-400'
                                                    }>
                                                        {email.threat}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell><ThreatBadge severity={email.severity} /></TableCell>
                                                <TableCell><StatusBadge status={email.status} /></TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleViewEmail(email)}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {email.status === 'quarantined' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleEmailAction('Releasing', email.id, email.subject)}
                                                                    className="text-emerald-400 hover:text-emerald-300"
                                                                >
                                                                    <Unlock className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleEmailAction('Deleting', email.id, email.subject)}
                                                                    className="text-red-400 hover:text-red-300"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="flow" className="space-y-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle className="text-gray-100">Mail Security Processing Flow</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {mockMailFlow.map((step, index) => (
                                        <motion.div
                                            key={step.step}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                                        >
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600">
                                                <step.icon className={`w-6 h-6 ${step.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-100">{step.name}</h3>
                                                <div className="flex gap-4 text-sm text-gray-400 mt-1">
                                                    {step.processed && <span>Processed: {step.processed.toLocaleString()}</span>}
                                                    {step.blocked && <span className="text-red-400">Blocked: {step.blocked}</span>}
                                                    {step.quarantined && <span className="text-orange-400">Quarantined: {step.quarantined}</span>}
                                                    {step.delivered && <span className="text-emerald-400">Delivered: {step.delivered}</span>}
                                                </div>
                                            </div>
                                            {index < mockMailFlow.length - 1 && (
                                                <ArrowRight className="w-5 h-5 text-gray-500" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader><CardTitle>Threat Distribution</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={mockThreatData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {mockThreatData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader><CardTitle>Security Trends (24h)</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={mockTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                                <Line type="monotone" dataKey="threats" name="Threats" stroke="#EF4444" strokeWidth={2} />
                                                <Line type="monotone" dataKey="quarantined" name="Quarantined" stroke="#F59E0B" strokeWidth={2} />
                                                <Line type="monotone" dataKey="clean" name="Clean" stroke="#10B981" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="threats" className="space-y-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader><CardTitle className="text-gray-100">Threat Analysis & Intelligence</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            <Bug className="w-4 h-4" />
                                            Malware Detected
                                        </h3>
                                        <div className="text-2xl font-bold text-red-400">12</div>
                                        <p className="text-sm text-gray-400 mt-1">Trojans, viruses, and exploits</p>
                                    </div>

                                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                        <h3 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Phishing Attempts
                                        </h3>
                                        <div className="text-2xl font-bold text-orange-400">15</div>
                                        <p className="text-sm text-gray-400 mt-1">Credential harvesting attempts</p>
                                    </div>

                                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                        <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                            <FileX className="w-4 h-4" />
                                            Spam & Suspicious
                                        </h3>
                                        <div className="text-2xl font-bold text-purple-400">46</div>
                                        <p className="text-sm text-gray-400 mt-1">Unwanted and suspicious content</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
