
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  KeyRound, 
  UserCheck, 
  UserX, 
  MapPin, 
  Clock, 
  Shield, 
  Lock, 
  Unlock,
  Activity,
  Monitor,
  Calendar,
  Cloud,
  Server,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ProviderIcon } from '../shared/ProviderIcons';

const mockLoginHistory = [
  { date: '2024-12-17 14:30', ip: '192.168.1.45', computer: 'DESKTOP-DEV01', success: true },
  { date: '2024-12-17 08:15', ip: '192.168.1.45', computer: 'DESKTOP-DEV01', success: true },
  { date: '2024-12-16 17:45', ip: '192.168.1.45', computer: 'DESKTOP-DEV01', success: true },
  { date: '2024-12-16 09:00', ip: '10.0.0.25', computer: 'LAPTOP-MOBILE', success: false },
  { date: '2024-12-15 13:20', ip: '192.168.1.45', computer: 'DESKTOP-DEV01', success: true },
];

const mockLicenses = {
  'azure-ad': [
    { id: '1', name: 'Microsoft 365 E3', status: 'assigned', description: 'Enterprise productivity suite', cost: '$36/month' },
    { id: '2', name: 'Azure AD Premium P2', status: 'assigned', description: 'Advanced identity protection', cost: '$9/month' },
    { id: '3', name: 'Microsoft Defender', status: 'available', description: 'Advanced threat protection', cost: '$2.50/month' },
    { id: '4', name: 'Power BI Pro', status: 'available', description: 'Business analytics service', cost: '$10/month' }
  ],
  'google-workspace': [
    { id: '1', name: 'Google Workspace Business Standard', status: 'assigned', description: 'Productivity and collaboration tools', cost: '$12/month' },
    { id: '2', name: 'Google Workspace Business Plus', status: 'available', description: 'Enhanced security and compliance', cost: '$18/month' },
    { id: '3', name: 'Google Cloud Identity Premium', status: 'available', description: 'Advanced security and device management', cost: '$6/month' }
  ]
};

export default function UserManagementModal({ isOpen, onClose, user }) {
    const [isLocked, setIsLocked] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        if (user) {
            setIsLocked(!user.enabled);
            setActiveTab('overview');
            // Load licenses based on service type
            if (user.service === 'azure-ad') {
                setLicenses(mockLicenses['azure-ad']);
            } else if (user.service === 'google-workspace') {
                setLicenses(mockLicenses['google-workspace']);
            } else {
                setLicenses([]);
            }
        }
    }, [user, isOpen]);

    if (!user) return null;

    const handleResetPassword = () => {
        if (!newPassword.trim()) {
            toast.error("Please enter a new password");
            return;
        }
        toast.success(`Password reset for ${user.name} - New password: ${newPassword}`);
        setNewPassword('');
    };

    const handleToggleLock = () => {
        setIsLocked(true);
        toast.success(`User ${user.name} locked successfully`);
    };

    const handleUnlockAccount = () => {
        setIsLocked(false);
        toast.success(`Account ${user.name} unlocked successfully`);
    };

    const handleLicenseToggle = (licenseId, isAssigned) => {
        const license = licenses.find(l => l.id === licenseId);
        if (isAssigned) {
            toast.success(`Assigned ${license.name} to ${user.name}`);
        } else {
            toast.success(`Removed ${license.name} from ${user.name}`);
        }
        
        setLicenses(prev => prev.map(l => 
            l.id === licenseId 
                ? { ...l, status: isAssigned ? 'assigned' : 'available' }
                : l
        ));
    };

    const getServiceIcon = (serviceType) => {
        const serviceIconMap = {
            'active-directory': 'Microsoft',
            'azure-ad': 'Azure',
            'google-workspace': 'Google Workspace',
            'ldap': 'LDAP',
            'okta': 'Okta'
        };
        
        const iconName = serviceIconMap[serviceType] || 'generic';
        return <ProviderIcon name={iconName} className="w-4 h-4" />;
    };

    const getLicenseStatusIcon = (status) => {
        switch (status) {
            case 'assigned': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'available': return <XCircle className="w-4 h-4 text-gray-400" />;
            case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            default: return <XCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getLicenseStatusColor = (status) => {
        const colors = {
            assigned: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            available: "bg-gray-500/20 text-gray-400 border-gray-500/30",
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        };
        return colors[status] || colors.available;
    };

    const shouldShowLicenseTab = user.service === 'azure-ad' || user.service === 'google-workspace';

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Close</Button>
            {isLocked && (
                <Button 
                    onClick={handleUnlockAccount}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Account
                </Button>
            )}
            {!isLocked && (
                <Button 
                    variant="destructive" 
                    onClick={handleToggleLock}
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Account
                </Button>
            )}
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`User Management: ${user.givenName} ${user.sn}`}
            description={`Manage account settings and view activity for ${user.name} in ${user.serviceName || 'Directory Service'}`}
            size="xl"
            footer={footer}
        >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-700 border-gray-600 mb-6">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                        <User className="w-4 h-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
                        <Activity className="w-4 h-4 mr-2" />
                        Login Activity
                    </TabsTrigger>
                    {shouldShowLicenseTab && (
                        <TabsTrigger value="licenses" className="data-[state=active]:bg-blue-600">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Licenses
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">User Information</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Username:</span>
                                    <span className="text-gray-100 font-medium">{user.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Full Name:</span>
                                    <span className="text-gray-100 font-medium">{user.givenName} {user.sn}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Directory Service:</span>
                                    <div className="flex items-center gap-2">
                                        <ProviderIcon name={user.serviceName} customUrl={user.serviceCustomIconUrl} className="w-4 h-4" />
                                        <span className="text-gray-100 font-medium text-sm">{user.serviceDisplayName}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Account Status:</span>
                                    <Badge className={isLocked ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}>
                                        {isLocked ? <Lock className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                                        {isLocked ? 'Locked' : 'Active'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Last Logon:</span>
                                    <span className="text-gray-100 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        {user.lastLogon}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Quick Actions</h3>
                            
                            <div className="space-y-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        className="w-full justify-start text-left bg-blue-600/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300"
                                        onClick={() => setActiveTab('security')}
                                    >
                                        <KeyRound className="w-4 h-4 mr-3" />
                                        Reset Password
                                    </Button>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        className="w-full justify-start text-left bg-purple-600/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300"
                                        onClick={() => setActiveTab('activity')}
                                    >
                                        <Monitor className="w-4 h-4 mr-3" />
                                        View Login Activity
                                    </Button>
                                </motion.div>

                                {shouldShowLicenseTab && (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            className="w-full justify-start text-left bg-green-600/20 border border-green-500/30 hover:bg-green-500/30 text-green-300"
                                            onClick={() => setActiveTab('licenses')}
                                        >
                                            <CreditCard className="w-4 h-4 mr-3" />
                                            Manage Licenses
                                        </Button>
                                    </motion.div>
                                )}
                                
                                {isLocked && (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            className="w-full justify-start text-left bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300"
                                            onClick={handleUnlockAccount}
                                        >
                                            <Unlock className="w-4 h-4 mr-3" />
                                            Unlock Account
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Password Management</h3>
                    
                    <div className="space-y-4 bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-gray-200">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password..."
                                className="bg-gray-700 border-gray-600 text-gray-100"
                            />
                        </div>
                        
                        <Button 
                            onClick={handleResetPassword}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            <KeyRound className="w-4 h-4 mr-2" />
                            Reset Password Now
                        </Button>
                    </div>

                    <div className="space-y-3 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <span className="font-semibold text-yellow-400">Security Notes</span>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 ml-6">
                            <li>• Password will be applied immediately</li>
                            <li>• User will need to login with new password</li>
                            <li>• Action will be logged in audit trail</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Login History</h3>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {mockLoginHistory.map((login, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${login.success ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <div>
                                        <div className="text-gray-100 font-medium">{login.computer}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {login.date}
                                            <MapPin className="w-3 h-3" />
                                            {login.ip}
                                        </div>
                                    </div>
                                </div>
                                <Badge className={login.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                                    {login.success ? 'Success' : 'Failed'}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {shouldShowLicenseTab && (
                    <TabsContent value="licenses" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-200">License Management</h3>
                            <div className="text-sm text-gray-400">
                                {user.service === 'azure-ad' ? 'Microsoft 365 / Azure' : 'Google Workspace'}
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {licenses.map((license) => (
                                <motion.div
                                    key={license.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getLicenseStatusIcon(license.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-100">{license.name}</h4>
                                                    <Badge className={`${getLicenseStatusColor(license.status)} border text-xs`}>
                                                        {license.status === 'assigned' ? 'Assigned' : license.status === 'pending' ? 'Pending' : 'Available'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">{license.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">Cost: {license.cost}</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={license.status === 'assigned'}
                                            onCheckedChange={(checked) => handleLicenseToggle(license.id, checked)}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 mt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-blue-400" />
                                <span className="font-semibold text-blue-400">License Information</span>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-1 ml-6">
                                <li>• License changes take effect within 24 hours</li>
                                <li>• Assigned licenses are billed to your organization</li>
                                <li>• Users will receive access to licensed features automatically</li>
                            </ul>
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </Modal>
    );
}
