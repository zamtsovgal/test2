import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateContainerModal({ isOpen, onClose, onCreate, image }) {
    const [config, setConfig] = useState({
        name: '',
        image: '',
        ports: '',
        volumes: '',
        env: '',
    });

    useEffect(() => {
        if (image) {
            setConfig(prev => ({ ...prev, image: `${image.name}:${image.tag}` }));
        } else {
             setConfig({ name: '', image: '', ports: '', volumes: '', env: '' });
        }
    }, [image, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setConfig(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(config);
        onClose();
    };
    
    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="create-container-form">Create & Run</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Container"
            description="Configure and launch a new Docker container."
            footer={footer}
        >
            <form id="create-container-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Container Name</Label>
                    <Input id="name" value={config.name} onChange={handleChange} className="bg-gray-700" placeholder="my-awesome-app"/>
                </div>
                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" value={config.image} onChange={handleChange} className="bg-gray-700" placeholder="ubuntu:latest" />
                </div>
                <div>
                    <Label htmlFor="ports">Port Mappings</Label>
                    <Input id="ports" value={config.ports} onChange={handleChange} className="bg-gray-700" placeholder="8080:80" />
                    <p className="text-xs text-gray-400 mt-1">e.g., 8080:80, 443:443</p>
                </div>
                <div>
                    <Label htmlFor="volumes">Volume Mappings</Label>
                    <Input id="volumes" value={config.volumes} onChange={handleChange} className="bg-gray-700" placeholder="/path/on/host:/path/in/container" />
                </div>
                <div>
                    <Label htmlFor="env">Environment Variables</Label>
                    <Input id="env" value={config.env} onChange={handleChange} className="bg-gray-700" placeholder="VAR=value;VAR2=value2" />
                </div>
            </form>
        </Modal>
    );
}