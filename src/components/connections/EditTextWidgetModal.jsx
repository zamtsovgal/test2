import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EditTextWidgetModal({ isOpen, onClose, onSave, widget }) {
    const [formData, setFormData] = useState({
        text: '',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        textColor: 'text-gray-100',
        backgroundColor: 'transparent',
        w: 2,
        h: 1
    });

    useEffect(() => {
        if (widget && isOpen) {
            setFormData({
                id: widget.id,
                text: widget.text || '',
                fontSize: widget.fontSize || 'text-lg',
                fontWeight: widget.fontWeight || 'font-semibold',
                textAlign: widget.textAlign || 'text-center',
                textColor: widget.textColor || 'text-gray-100',
                backgroundColor: widget.backgroundColor || 'transparent',
                w: widget.w || 2,
                h: widget.h || 1
            });
        }
    }, [widget, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field, value) => {
        if (field === 'size') {
            const [w, h] = value.split('x').map(Number);
            setFormData(prev => ({ ...prev, w, h }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="edit-text-widget-form" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Text Widget"
            description="Update your text widget."
            footer={footer}
            size="lg"
        >
            <form id="edit-text-widget-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="text">Text Content</Label>
                    <Textarea 
                        id="text" 
                        value={formData.text} 
                        onChange={handleChange} 
                        className="bg-gray-700 border-gray-600 mt-2 h-20" 
                        placeholder="Enter your text here..." 
                        required
                    />
                </div>
                
                {/* Same form fields as AddTextWidgetModal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Font Size</Label>
                        <Select value={formData.fontSize} onValueChange={(value) => handleSelectChange('fontSize', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text-xs">Extra Small</SelectItem>
                                <SelectItem value="text-sm">Small</SelectItem>
                                <SelectItem value="text-base">Base</SelectItem>
                                <SelectItem value="text-lg">Large</SelectItem>
                                <SelectItem value="text-xl">Extra Large</SelectItem>
                                <SelectItem value="text-2xl">2X Large</SelectItem>
                                <SelectItem value="text-3xl">3X Large</SelectItem>
                                <SelectItem value="text-4xl">4X Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Font Weight</Label>
                        <Select value={formData.fontWeight} onValueChange={(value) => handleSelectChange('fontWeight', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="font-normal">Normal</SelectItem>
                                <SelectItem value="font-medium">Medium</SelectItem>
                                <SelectItem value="font-semibold">Semi Bold</SelectItem>
                                <SelectItem value="font-bold">Bold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Text Alignment</Label>
                        <Select value={formData.textAlign} onValueChange={(value) => handleSelectChange('textAlign', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text-left">Left</SelectItem>
                                <SelectItem value="text-center">Center</SelectItem>
                                <SelectItem value="text-right">Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Text Color</Label>
                        <Select value={formData.textColor} onValueChange={(value) => handleSelectChange('textColor', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text-gray-100">White</SelectItem>
                                <SelectItem value="text-gray-300">Gray</SelectItem>
                                <SelectItem value="text-blue-400">Blue</SelectItem>
                                <SelectItem value="text-emerald-400">Green</SelectItem>
                                <SelectItem value="text-purple-400">Purple</SelectItem>
                                <SelectItem value="text-yellow-400">Yellow</SelectItem>
                                <SelectItem value="text-red-400">Red</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Background</Label>
                        <Select value={formData.backgroundColor} onValueChange={(value) => handleSelectChange('backgroundColor', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="transparent">Transparent</SelectItem>
                                <SelectItem value="bg-gray-800/50">Dark Gray</SelectItem>
                                <SelectItem value="bg-blue-600/20">Blue Tint</SelectItem>
                                <SelectItem value="bg-emerald-600/20">Green Tint</SelectItem>
                                <SelectItem value="bg-purple-600/20">Purple Tint</SelectItem>
                                <SelectItem value="bg-yellow-600/20">Yellow Tint</SelectItem>
                                <SelectItem value="bg-red-600/20">Red Tint</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Size</Label>
                        <Select value={`${formData.w}x${formData.h}`} onValueChange={(value) => handleSelectChange('size', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1x1">Small (1x1)</SelectItem>
                                <SelectItem value="2x1">Wide (2x1)</SelectItem>
                                <SelectItem value="3x1">Extra Wide (3x1)</SelectItem>
                                <SelectItem value="4x1">Full Width (4x1)</SelectItem>
                                <SelectItem value="1x2">Tall (1x2)</SelectItem>
                                <SelectItem value="2x2">Large (2x2)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}