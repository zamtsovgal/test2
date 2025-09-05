import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddShareModal({ isOpen, onClose, onSave, share }) {
    const [formData, setFormData] = useState({
        name: '',
        path: '',
        access: 'private',
    });

    useEffect(() => {
        if (share) {
            setFormData({
                name: share.name || '',
                path: share.path || '',
                access: share.access || 'private',
            });
        } else {
            setFormData({ name: '', path: '', access: 'private' });
        }
    }, [share, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, access: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="share-form">{share ? 'Save Changes' : 'Create Share'}</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={share ? 'Edit Network Share' : 'Add Network Share'}
            description="Configure a new network share on your storage system."
            footer={footer}
        >
            <form id="share-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Share Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} className="bg-gray-700" placeholder="e.g., Media" />
                </div>
                <div>
                    <Label htmlFor="path">Path</Label>
                    <Input id="path" value={formData.path} onChange={handleChange} className="bg-gray-700" placeholder="e.g., /volume1/Media" />
                </div>
                <div>
                    <Label htmlFor="access">Access</Label>
                    <Select value={formData.access} onValueChange={handleSelectChange}>
                        <SelectTrigger id="access" className="bg-gray-700">
                            <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </form>
        </Modal>
    );
}