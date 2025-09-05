import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AddStorageModal({ isOpen, onClose, onSave, storage }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'nas',
        host: '',
        port: '',
        username: '',
        password: '',
        ssl: true,
        protocol: 'smb'
    });

    useEffect(() => {
        if (storage) {
            setFormData({
                name: storage.name || '',
                type: storage.type || 'nas',
                host: storage.host || '',
                port: storage.port || '',
                username: storage.username || '',
                password: '',
                ssl: storage.ssl !== undefined ? storage.ssl : true,
                protocol: storage.protocol || 'smb'
            });
        } else {
            setFormData({
                name: '',
                type: 'nas',
                host: '',
                port: '',
                username: '',
                password: '',
                ssl: true,
                protocol: 'smb'
            });
        }
    }, [storage, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({ ...prev, ssl: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="storage-form">{storage ? 'Save Changes' : 'Add Storage System'}</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={storage ? 'Edit Storage System' : 'Add Storage System'}
            description="Configure a new storage system for monitoring."
            footer={footer}
        >
            <form id="storage-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Storage Name</Label>
                    <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="e.g., Synology-DS920+" 
                    />
                </div>
                
                <div>
                    <Label htmlFor="type">Storage Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                        <SelectTrigger className="bg-gray-700">
                            <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nas">NAS (Network Attached Storage)</SelectItem>
                            <SelectItem value="san">SAN (Storage Area Network)</SelectItem>
                            <SelectItem value="iscsi">iSCSI Target</SelectItem>
                            <SelectItem value="nfs">NFS Server</SelectItem>
                            <SelectItem value="smb">SMB/CIFS Server</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="host">Host/IP Address</Label>
                    <Input 
                        id="host" 
                        value={formData.host} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="e.g., 192.168.1.200" 
                    />
                </div>

                <div>
                    <Label htmlFor="port">Port</Label>
                    <Input 
                        id="port" 
                        type="number" 
                        value={formData.port} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="Default port for protocol" 
                    />
                </div>

                <div>
                    <Label htmlFor="protocol">Access Protocol</Label>
                    <Select value={formData.protocol} onValueChange={(value) => handleSelectChange('protocol', value)}>
                        <SelectTrigger className="bg-gray-700">
                            <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="smb">SMB/CIFS</SelectItem>
                            <SelectItem value="nfs">NFS</SelectItem>
                            <SelectItem value="iscsi">iSCSI</SelectItem>
                            <SelectItem value="ssh">SSH/SFTP</SelectItem>
                            <SelectItem value="ftp">FTP</SelectItem>
                            <SelectItem value="webdav">WebDAV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input 
                        id="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="Storage admin username" 
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
                        placeholder="Storage admin password" 
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="ssl">Use SSL/TLS</Label>
                        <p className="text-sm text-gray-400">Enable secure connections</p>
                    </div>
                    <Switch 
                        id="ssl" 
                        checked={formData.ssl} 
                        onCheckedChange={handleSwitchChange} 
                    />
                </div>
            </form>
        </Modal>
    );
}