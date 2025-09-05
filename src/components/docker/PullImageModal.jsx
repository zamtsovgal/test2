import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PullImageModal({ isOpen, onClose, onPull }) {
    const [imageName, setImageName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onPull(imageName);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="pull-image-form">Pull</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Pull Docker Image"
            description="Enter the name of the Docker image to pull (e.g., 'ubuntu:latest')."
            footer={footer}
        >
            <form id="pull-image-form" onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageName" className="text-right">Image</Label>
                    <Input
                        id="imageName"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        className="col-span-3 bg-gray-700"
                        placeholder="image:tag"
                    />
                </div>
            </form>
        </Modal>
    );
}