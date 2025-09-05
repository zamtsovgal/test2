import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AddServerModal({ isOpen, onClose, onSave, server }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'generic',
    host: '',
    port: '',
    username: '',
    password: '',
    ssl: true,
  });

  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name || '',
        type: server.type || 'generic',
        host: server.host || '',
        port: server.port || '',
        username: server.username || '',
        password: '',
        ssl: server.ssl !== undefined ? server.ssl : true,
      });
    } else {
      setFormData({
        name: '',
        type: 'generic',
        host: '',
        port: '',
        username: '',
        password: '',
        ssl: true,
      });
    }
  }, [server, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, ssl: checked }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({...prev, type: value}));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button type="submit" form="server-form">{server ? 'Save Changes' : 'Add Server'}</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={server ? 'Edit Server' : 'Add New Server'}
      description="Enter the details for the server you want to monitor."
      footer={footer}
    >
      <form id="server-form" onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3 bg-gray-700">
                    <SelectValue placeholder="Select server type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="esxi">ESXi</SelectItem>
                    <SelectItem value="vcenter">vCenter</SelectItem>
                    <SelectItem value="nas">NAS</SelectItem>
                    <SelectItem value="docker">Docker</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="host" className="text-right">Host/IP</Label>
          <Input id="host" value={formData.host} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="port" className="text-right">Port</Label>
          <Input id="port" type="number" value={formData.port} onChange={handleChange} className="col-span-3 bg-gray-700" placeholder="Default"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">Username</Label>
          <Input id="username" value={formData.username} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ssl" className="text-right">Use SSL</Label>
          <Switch id="ssl" checked={formData.ssl} onCheckedChange={handleSwitchChange} />
        </div>
      </form>
    </Modal>
  );
}