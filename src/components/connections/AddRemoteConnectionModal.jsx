import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddRemoteConnectionModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        host: '',
        type: 'rdp',
        os: 'windows',
        port: 3389,
        username: '',
        password: '',
        domain: '',
        description: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field, value) => {
        let updatedData = { ...formData, [field]: value };
        
        if (field === 'type') {
            if (value === 'rdp') {
                updatedData.port = 3389;
                updatedData.os = 'windows';
            } else if (value === 'ssh') {
                updatedData.port = 22;
                updatedData.os = 'linux';
            } else if (value === 'web') {
                updatedData.port = 443;
                updatedData.os = 'appliance';
            }
        }
        
        setFormData(updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ name: '', host: '', type: 'rdp', os: 'windows', port: 3389, username: '', password: '', domain: '', description: '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/90 backdrop-blur-sm border-gray-700/50 text-gray-100 sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">Add Remote Connection</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Configure a new remote connection for SSH, RDP, or Web access.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Connection Name</Label>
                            <Input id="name" value={formData.name} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" placeholder="Production Server" required />
                        </div>
                        <div>
                            <Label htmlFor="host">Host/IP Address</Label>
                            <Input id="host" value={formData.host} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" placeholder="192.168.1.100" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Connection Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                <SelectTrigger className="mt-2 bg-gray-800/80 border-gray-600"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="rdp">RDP</SelectItem><SelectItem value="ssh">SSH</SelectItem><SelectItem value="web">Web</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Operating System</Label>
                            <Select value={formData.os} onValueChange={(value) => handleSelectChange('os', value)}>
                                <SelectTrigger className="mt-2 bg-gray-800/80 border-gray-600"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="windows">Windows</SelectItem><SelectItem value="linux">Linux</SelectItem><SelectItem value="appliance">Appliance</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="port">Port</Label>
                            <Input id="port" type="number" value={formData.port} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={formData.username} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" placeholder="administrator" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={formData.password} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" placeholder="••••••••" />
                        </div>
                        <div>
                            <Label htmlFor="domain">Domain</Label>
                            <Input id="domain" value={formData.domain} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600" placeholder="corp.local" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={handleChange} className="mt-2 bg-gray-800/80 border-gray-600 h-20" placeholder="Brief description of this connection..." />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Add Connection</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}