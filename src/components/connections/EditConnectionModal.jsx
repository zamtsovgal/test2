
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProviderIcon, getAllAvailableIcons } from '../shared/ProviderIcons';
import { Search, Upload, X } from 'lucide-react';
import { UploadFile } from "@/api/integrations";
import { toast } from "sonner";

const categories = [
    'Development', 'Database', 'Web Server', 'Monitoring', 'Media', 'Storage', 
    'Home Automation', 'Virtualization', 'Security', 'Network', 'Communication', 'Cloud', 'Other'
];

export default function EditConnectionModal({ isOpen, onClose, onSave, connection }) {
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '', // Added subtitle field
        iconName: 'Docker',
        customIconUrl: '',
        url: '',
        category: 'Development',
        w: 1,
        h: 1
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isUploading, setIsUploading] = useState(false);

    const availableIcons = getAllAvailableIcons();

    useEffect(() => {
        if (connection && isOpen) {
            setFormData({
                id: connection.id,
                name: connection.name || '',
                subtitle: connection.subtitle || '', // Initialize subtitle from connection prop
                iconName: connection.iconName || 'Docker',
                customIconUrl: connection.customIconUrl || '',
                url: connection.url || '',
                category: connection.category || 'Development',
                w: connection.w || 1,
                h: connection.h || 1
            });
        }
    }, [connection, isOpen]);

    const filteredIcons = availableIcons.filter(icon => {
        const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            icon.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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

    const handleIconSelect = (iconId) => {
        setFormData(prev => ({ ...prev, iconName: iconId, customIconUrl: '' }));
        setShowIconPicker(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        setIsUploading(true);
        try {
            const { file_url } = await UploadFile({ file });
            setFormData(prev => ({ 
                ...prev, 
                customIconUrl: file_url, 
                iconName: 'custom'
            }));
            toast.success('Icon uploaded successfully!');
        } catch (error) {
            toast.error('Failed to upload icon');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const clearCustomIcon = () => {
        setFormData(prev => ({ ...prev, customIconUrl: '', iconName: 'Docker' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setSearchTerm('');
        setShowIconPicker(false);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="edit-connection-form" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Connection"
            description="Update the connection details."
            footer={footer}
        >
            <form id="edit-connection-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="e.g., My Service" 
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                    <Input 
                        id="subtitle" 
                        value={formData.subtitle} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="e.g., Manages all containers" 
                    />
                </div>
                <div>
                    <Label htmlFor="url">URL</Label>
                    <Input 
                        id="url" 
                        value={formData.url} 
                        onChange={handleChange} 
                        className="bg-gray-700" 
                        placeholder="https://service.example.com" 
                        required
                    />
                </div>
                <div>
                    <Label>Icon</Label>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-gray-700 hover:bg-gray-600 flex items-center gap-3 justify-start"
                                onClick={() => setShowIconPicker(!showIconPicker)}
                            >
                                {formData.customIconUrl ? (
                                    <img src={formData.customIconUrl} alt="Custom" className="w-6 h-6 object-contain rounded" />
                                ) : (
                                    <ProviderIcon name={formData.iconName} className="w-6 h-6" />
                                )}
                                <span className="flex-1 text-left">
                                    {formData.customIconUrl ? 'Custom Icon' : formData.iconName}
                                </span>
                            </Button>
                            
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="icon-upload-edit"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-gray-700 hover:bg-gray-600"
                                    onClick={() => document.getElementById('icon-upload-edit').click()}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            {formData.customIconUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
                                    onClick={clearCustomIcon}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        
                        {showIconPicker && (
                            <div className="border border-gray-600 rounded-lg p-4 bg-gray-800 max-h-96 overflow-y-auto">
                                <div className="mb-4 space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search icons..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-gray-700"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={selectedCategory === 'All' ? 'default' : 'outline'}
                                            onClick={() => setSelectedCategory('All')}
                                            className="text-xs"
                                        >
                                            All
                                        </Button>
                                        {categories.map(category => (
                                            <Button
                                                key={category}
                                                type="button"
                                                size="sm"
                                                variant={selectedCategory === category ? 'default' : 'outline'}
                                                onClick={() => setSelectedCategory(category)}
                                                className="text-xs"
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredIcons.map(icon => (
                                        <button
                                            key={icon.id}
                                            type="button"
                                            onClick={() => handleIconSelect(icon.id)}
                                            className={`p-3 rounded-lg border transition-all duration-200 hover:bg-gray-600 flex flex-col items-center gap-2 ${
                                                formData.iconName === icon.id && !formData.customIconUrl
                                                    ? 'border-blue-500 bg-blue-500/20' 
                                                    : 'border-gray-600'
                                            }`}
                                        >
                                            <ProviderIcon name={icon.id} className="w-8 h-8" />
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-gray-300 truncate w-full">{icon.name}</p>
                                                <p className="text-xs text-gray-500">{icon.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {filteredIcons.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No icons found matching your search.</p>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                            className="mt-2"
                                        >
                                            Clear filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                            <SelectTrigger className="bg-gray-700">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>Size</Label>
                        <Select value={`${formData.w}x${formData.h}`} onValueChange={(value) => handleSelectChange('size', value)}>
                            <SelectTrigger className="bg-gray-700">
                                <SelectValue placeholder="Select a size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1x1">Small (1x1)</SelectItem>
                                <SelectItem value="2x1">Wide (2x1)</SelectItem>
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
