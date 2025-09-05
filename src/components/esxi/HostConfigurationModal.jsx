import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function HostConfigurationModal({ isOpen, onClose, onSave, host }) {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 443,
    username: '',
    password: '',
    ssl: true,
  });

  useEffect(() => {
    if (host) {
      setFormData({
        name: host.name || '',
        host: host.host || '',
        port: host.port || 443,
        username: host.username || '',
        password: '',
        ssl: host.ssl !== undefined ? host.ssl : true,
      });
    } else {
      setFormData({
        name: '',
        host: '',
        port: 443,
        username: '',
        password: '',
        ssl: true,
      });
    }
  }, [host, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
      <Button type="submit" form="host-form">{host ? 'Save Changes' : 'Add Host'}</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={host ? 'Edit Host' : 'Add New Host'}
      description="Enter the details for your ESXi or vCenter host."
      footer={footer}
    >
      <form id="host-form" onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="host" className="text-right">Host/IP</Label>
          <Input id="host" value={formData.host} onChange={handleChange} className="col-span-3 bg-gray-700" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="port" className="text-right">Port</Label>
          <Input id="port" type="number" value={formData.port} onChange={handleChange} className="col-span-3 bg-gray-700" />
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