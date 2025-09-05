
import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProviderIcon, getAllAvailableIcons, searchIcons, getIconCategories } from '../shared/ProviderIcons';
import { Search, Upload, X, ExternalLink } from 'lucide-react';
import { UploadFile } from "@/api/integrations";
import { toast } from "sonner";

const categories = [
    'Development', 'Database', 'Web Server', 'Monitoring', 'Media', 'Storage', 
    'Home Automation', 'Virtualization', 'Security', 'Network', 'Communication', 'Cloud', 'Other'
];

export default function AddConnectionModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '', // Added new subtitle field
        iconName: 'Docker',
        customIconUrl: '',
        url: '',
        category: 'Development',
        w: 2, // Changed default width from 1 to 2
        h: 1
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isUploading, setIsUploading] = useState(false);

    const iconCategories = getIconCategories();
    const filteredIcons = searchIcons(searchTerm, selectedCategory);

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
        toast.success(`Selected ${iconId} icon`);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 2MB)
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
            toast.success('Custom icon uploaded successfully!');
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
        // Changed reset values for w and h to match the new default (2x1)
        // Also added subtitle to reset
        setFormData({ name: '', subtitle: '', iconName: 'Docker', customIconUrl: '', url: '', category: 'Development', w: 2, h: 1 });
        setSearchTerm('');
        setShowIconPicker(false);
        onClose();
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="connection-form" className="bg-emerald-600 hover:bg-emerald-700">Add Connection</Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Connection"
            description="Add a new service connection with official company logos."
            footer={footer}
            size="lg"
        >
            <form id="connection-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="bg-gray-700 border-gray-600 mt-2" 
                        placeholder="e.g., My Docker Registry" 
                        required
                    />
                </div>
                
                {/* New Subtitle Input */}
                <div>
                    <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                    <Input 
                        id="subtitle" 
                        value={formData.subtitle} 
                        onChange={handleChange} 
                        className="bg-gray-700 border-gray-600 mt-2" 
                        placeholder="e.g., Manages all containers" 
                    />
                </div>
                
                <div>
                    <Label htmlFor="url">URL</Label>
                    <Input 
                        id="url" 
                        value={formData.url} 
                        onChange={handleChange} 
                        className="bg-gray-700 border-gray-600 mt-2" 
                        placeholder="https://portainer.example.com" 
                        required
                    />
                </div>
                
                <div>
                    <Label>Official Service Logo</Label>
                    <div className="space-y-3 mt-2">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-gray-700 hover:bg-gray-600 border-gray-600 flex items-center gap-3 justify-start p-3 h-auto"
                                onClick={() => setShowIconPicker(!showIconPicker)}
                            >
                                <div className="w-8 h-8">
                                    <ProviderIcon 
                                        name={formData.iconName} 
                                        customUrl={formData.customIconUrl}
                                        className="w-8 h-8"
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium">
                                        {formData.customIconUrl ? 'Custom Icon' : formData.iconName}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formData.customIconUrl ? 'Uploaded image' : 'Official company logo'}
                                    </p>
                                </div>
                            </Button>
                            
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="icon-upload"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                                    onClick={() => document.getElementById('icon-upload').click()}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            {formData.customIconUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50"
                                    onClick={clearCustomIcon}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        
                        {showIconPicker && (
                            <div className="border border-gray-600 rounded-xl p-6 bg-gray-800/50 backdrop-blur max-h-[500px] overflow-y-auto">
                                <div className="mb-6 space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search for services (e.g., Docker, Plex, Nginx)..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-gray-700 border-gray-600"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {iconCategories.map(category => (
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
                                
                                <div className="grid grid-cols-4 gap-4">
                                    {filteredIcons.map(icon => (
                                        <button
                                            key={icon.id}
                                            type="button"
                                            onClick={() => handleIconSelect(icon.id)}
                                            className={`group p-4 rounded-xl border transition-all duration-200 hover:bg-gray-600/50 flex flex-col items-center gap-3 ${
                                                formData.iconName === icon.id && !formData.customIconUrl
                                                    ? 'border-blue-500 bg-blue-500/10 shadow-lg' 
                                                    : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                        >
                                            <div className="w-12 h-12">
                                                <ProviderIcon name={icon.id} className="w-12 h-12 transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-gray-300 truncate w-full">{icon.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{icon.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                
                                {filteredIcons.length === 0 && (
                                    <div className="text-center py-12 text-gray-400">
                                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No icons found</p>
                                        <p className="text-sm">Try a different search term or category</p>
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                            className="mt-4"
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
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
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
                            <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
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
