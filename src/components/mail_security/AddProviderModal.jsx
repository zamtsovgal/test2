import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProviderModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'cloud',
    icon: 'mail',
    status: 'disconnected',
  });

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: Date.now() });
    onClose();
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button type="submit" form="provider-form">Add Provider</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Mail Provider"
      description="Configure a new local or cloud-based mail relay service."
      footer={footer}
    >
      <form id="provider-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="col-span-3 bg-gray-700" placeholder="e.g., SendGrid" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Description</Label>
          <Input id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="col-span-3 bg-gray-700" placeholder="Transactional Email API" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger className="col-span-3 bg-gray-700">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="icon" className="text-right">Icon Name</Label>
          <Input id="icon" value={formData.icon} onChange={(e) => handleChange('icon', e.target.value)} className="col-span-3 bg-gray-700" placeholder="e.g., sendgrid, mailgun" />
        </div>
      </form>
    </Modal>
  );
}