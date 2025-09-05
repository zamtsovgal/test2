
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EditRemoteConnectionModal({ isOpen, onClose, onSave, connection }) {
    const [formData, setFormData] = useState({
        name: '',
        host: '',
        type: 'rdp',
        os: 'windows',
        port: 3389,
        username: '',
        password: '', // Added password field
        domain: '', // Added domain field
        description: ''
    });

    useEffect(() => {
        if (connection) {
            setFormData({
                id: connection.id,
                name: connection.name || '',
                host: connection.host || '',
                type: connection.type || 'rdp',
                os: connection.os || 'windows',
                port: connection.port || 3389,
                username: connection.username || '',
                password: connection.password || '', // Initialize password from connection
                domain: connection.domain || '',     // Initialize domain from connection
                description: connection.description || ''
            });
        }
    }, [connection, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="edit-remote-connection-form" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Remote Connection"
            description="Update the remote connection settings."
            footer={footer}
        >
            <form id="edit-remote-connection-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Connection Name</Label>
                        <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            placeholder="e.g., Production Server" 
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="host">Host/IP Address</Label>
                        <Input 
                            id="host" 
                            value={formData.host} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            placeholder="192.168.1.100" 
                            required
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Connection Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                            <SelectTrigger className="bg-gray-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rdp">RDP (Remote Desktop)</SelectItem>
                                <SelectItem value="ssh">SSH (Terminal)</SelectItem>
                                <SelectItem value="web">Web Interface</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Operating System</Label>
                        <Select value={formData.os} onValueChange={(value) => handleSelectChange('os', value)}>
                            <SelectTrigger className="bg-gray-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="windows">Windows</SelectItem>
                                <SelectItem value="linux">Linux</SelectItem>
                                <SelectItem value="appliance">Appliance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="port">Port</Label>
                        <Input 
                            id="port" 
                            type="number"
                            value={formData.port} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            required
                        />
                    </div>
                </div>
                
                {/* Added new grid for authentication fields */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                            id="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            placeholder="administrator / root / admin" 
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            placeholder="••••••••" 
                        />
                    </div>
                    <div>
                        <Label htmlFor="domain">Domain</Label>
                        <Input 
                            id="domain" 
                            value={formData.domain} 
                            onChange={handleChange} 
                            className="bg-gray-700" 
                            placeholder="DOMAIN / workgroup" 
                        />
                    </div>
                </div>
                
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        id="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        className="bg-gray-700 h-20" 
                        placeholder="Brief description of this connection..." 
                    />
                </div>
            </form>
        </Modal>
    );
}
