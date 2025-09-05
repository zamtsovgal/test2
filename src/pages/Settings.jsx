
import React, { useState, useEffect } from "react";
import { Server, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Server as ServerIcon, 
  Bell, 
  Shield, 
  User as UserIcon,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertTriangle,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AddServerModal from "../components/settings/AddServerModal";
import { ProviderIcon } from "../components/shared/ProviderIcons";

const integrationCategories = {
    'Cloud Services': [
        { name: 'AWS', connected: false, description: 'Amazon Web Services' },
        { name: 'Azure', connected: false, description: 'Microsoft Azure' },
        { name: 'Google Cloud', connected: false, description: 'Google Cloud Platform' },
    ],
    'Mail Services': [
        { name: 'Google Workspace', connected: true, description: 'Gmail, Calendar, Drive integration' },
        { name: 'Microsoft 365', connected: true, description: 'Outlook, Teams, OneDrive integration' },
        { name: 'Apple iCloud', connected: false, description: 'iCloud Mail and Calendar' },
    ],
    'Security & EDR': [
        { name: 'SentinelOne', connected: true, description: 'AI-powered endpoint protection' },
        { name: 'Microsoft Defender', connected: false, description: 'Windows Defender ATP' },
        { name: 'ESET', connected: true, description: 'ESET Endpoint Security' },
    ],
    'Virtualization': [
        { name: 'VMware vSphere', connected: true, description: 'vCenter and ESXi integration' },
        { name: 'Hyper-V', connected: false, description: 'Microsoft Hyper-V' },
        { name: 'Proxmox', connected: true, description: 'Proxmox VE cluster' },
    ],
    'Containers': [
        { name: 'Docker', connected: true, description: 'Docker Engine API' },
        { name: 'Kubernetes', connected: false, description: 'Kubernetes clusters' },
        { name: 'Portainer', connected: true, description: 'Container management UI' },
    ],
    'Authentication': [
        { name: 'Active Directory', connected: true, description: 'Windows domain services' },
        { name: 'LDAP', connected: true, description: 'LDAP directory services' },
        { name: 'Azure AD', connected: false, description: 'Azure Active Directory' },
    ],
};

export default function SettingsPage() {
  const [servers, setServers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      criticalOnly: false,
      maintenanceNotifications: true,
      performanceAlerts: true
    },
    monitoring: {
      checkInterval: 60,
      retryAttempts: 3,
      timeout: 30,
      autoDiscovery: false
    },
    security: {
      requireMFA: false,
      sessionTimeout: 480,
      strongPasswords: true,
      auditLogging: true
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [serverData, userData] = await Promise.all([
        Server.list(),
        User.me()
      ]);
      setServers(serverData);
      setCurrentUser(userData);
    } catch (error) {
      console.log("Settings load error:", error);
      toast.error("Failed to load settings.");
    }
  };

  const handleOpenModal = (server = null) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleSaveServer = (serverData) => {
    if (editingServer) {
      toast.success(`Server "${serverData.name}" updated!`);
    } else {
      toast.success(`Server "${serverData.name}" added!`);
    }
    setIsModalOpen(false);
    loadSettings();
  };

  const saveSettings = async () => {
    try {
      await User.updateMyUserData({ settings });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings.");
      console.error("Failed to save settings:", error);
    }
  };

  const deleteServer = async (serverId, serverName) => {
    toast(`Are you sure you want to delete ${serverName}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          toast.success(`${serverName} deleted.`);
          loadSettings();
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const handleIntegrationToggle = (categoryName, integrationName, currentState) => {
    if (currentState) {
      toast.info(`Disconnecting from ${integrationName}...`);
    } else {
      toast.info(`Connecting to ${integrationName}...`);
    }
    // In a real app, you would update the state here to reflect the change.
  };

  const getServerTypeIcon = (type) => {
    switch (type) {
      case 'esxi': return '🖥️';
      case 'nas': return '💾';
      case 'docker': return '🐳';
      default: return '🖥️';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      online: "text-emerald-400 bg-emerald-400/20",
      offline: "text-red-400 bg-red-400/20",
      warning: "text-yellow-400 bg-yellow-400/20"
    };
    return colors[status] || colors.offline;
  };

  return (
    <>
      <AddServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveServer}
        server={editingServer}
      />
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Settings</h1>
            <p className="text-gray-400">Configure your homelab monitoring and management</p>
          </div>
          <Button onClick={saveSettings} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="servers" className="data-[state=active]:bg-blue-600">
              <ServerIcon className="w-4 h-4 mr-2" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600">
              <Zap className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <ServerIcon className="w-5 h-5" />
                    Server Management
                  </CardTitle>
                  <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Server
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servers.map((server, index) => (
                    <motion.div
                      key={server.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{getServerTypeIcon(server.type)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                              {server.name}
                              <Badge className={`${getStatusColor(server.status)}`}>
                                {server.status}
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-400">
                              {server.host}:{server.port || 'default'} • {server.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={() => handleOpenModal(server)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                            onClick={() => deleteServer(server.id, server.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {servers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <ServerIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p>No servers configured yet</p>
                      <p className="text-sm">Add your first server to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {Object.entries(integrationCategories).map(([categoryName, integrations]) => (
              <Card key={categoryName} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {categoryName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {integrations.map((integration, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center justify-between bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-900/50 flex items-center justify-center text-lg">
                           <ProviderIcon name={integration.name} className="w-6 h-6"/>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-100">{integration.name}</h3>
                          <p className="text-sm text-gray-400">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {integration.connected ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-400"/>
                              <span className="font-medium text-emerald-400">Connected</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-gray-400"/>
                              <span className="font-medium text-gray-400">Not Connected</span>
                            </>
                          )}
                        </div>
                        <Button 
                          variant={integration.connected ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleIntegrationToggle(categoryName, integration.name, integration.connected)}
                        >
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Email Alerts</Label>
                    <p className="text-sm text-gray-400">Receive email notifications for system events</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailAlerts: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Critical Alerts Only</Label>
                    <p className="text-sm text-gray-400">Only receive notifications for critical issues</p>
                  </div>
                  <Switch
                    checked={settings.notifications.criticalOnly}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, criticalOnly: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Maintenance Notifications</Label>
                    <p className="text-sm text-gray-400">Get notified about scheduled maintenance</p>
                  </div>
                  <Switch
                    checked={settings.notifications.maintenanceNotifications}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, maintenanceNotifications: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Performance Alerts</Label>
                    <p className="text-sm text-gray-400">Alerts for high CPU, memory, or disk usage</p>
                  </div>
                  <Switch
                    checked={settings.notifications.performanceAlerts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, performanceAlerts: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Monitoring Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-100">Check Interval (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.monitoring.checkInterval}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, checkInterval: parseInt(e.target.value) }
                        }))
                      }
                      className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <p className="text-sm text-gray-400 mt-1">How often to check server status</p>
                  </div>

                  <div>
                    <Label className="text-gray-100">Retry Attempts</Label>
                    <Input
                      type="number"
                      value={settings.monitoring.retryAttempts}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, retryAttempts: parseInt(e.target.value) }
                        }))
                      }
                      className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <p className="text-sm text-gray-400 mt-1">Failed connection retry count</p>
                  </div>

                  <div>
                    <Label className="text-gray-100">Connection Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={settings.monitoring.timeout}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, timeout: parseInt(e.target.value) }
                        }))
                      }
                      className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <p className="text-sm text-gray-400 mt-1">Timeout for server connections</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-100">Auto Discovery</Label>
                      <p className="text-sm text-gray-400">Automatically discover new services</p>
                    </div>
                    <Switch
                      checked={settings.monitoring.autoDiscovery}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, autoDiscovery: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Require Multi-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Enhance security with MFA</p>
                  </div>
                  <Switch
                    checked={settings.security.requireMFA}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireMFA: checked }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="text-gray-100">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))
                    }
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  />
                  <p className="text-sm text-gray-400 mt-1">Automatic logout after inactivity</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Strong Password Requirements</Label>
                    <p className="text-sm text-gray-400">Enforce complex password policies</p>
                  </div>
                  <Switch
                    checked={settings.security.strongPasswords}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, strongPasswords: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-100">Audit Logging</Label>
                    <p className="text-sm text-gray-400">Log all user actions and system events</p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogging}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, auditLogging: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-100">Full Name</Label>
                      <Input
                        value={currentUser.full_name || ''}
                        disabled
                        className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-100">Email Address</Label>
                      <Input
                        value={currentUser.email || ''}
                        disabled
                        className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-100">Role</Label>
                      <Input
                        value={currentUser.role || 'user'}
                        disabled
                        className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-100">Member Since</Label>
                      <Input
                        value={new Date(currentUser.created_date).toLocaleDateString()}
                        disabled
                        className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-400">Account Security</h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Your account is secured through Google OAuth. To update your profile information,
                        please update it in your Google account settings.
                      </p>
                    </div>
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
