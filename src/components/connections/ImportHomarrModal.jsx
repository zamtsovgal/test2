
import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

export default function ImportHomarrModal({ isOpen, onClose, onImport }) {
    const [configText, setConfigText] = useState('');
    const [importResults, setImportResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const parseHomarrConfig = (configText) => {
        try {
            const config = JSON.parse(configText);
            const connections = [];

            if (config.apps && Array.isArray(config.apps)) {
                config.apps.forEach(app => {
                    // Skip if no name or URL
                    if (!app.name || !app.url) return;

                    // Determine category based on app name/type
                    const getCategory = (name) => {
                        const lowerName = name.toLowerCase();
                        if (['plex', 'tautulli', 'overseerr', 'radarr', 'sonarr'].includes(lowerName)) return 'Media';
                        if (['portainer', 'docker', 'npm-app'].some(term => lowerName.includes(term))) return 'Development';
                        if (['adguard', 'pihole'].includes(lowerName)) return 'Security';
                        if (['vcenter', 'esxi', 'vmm'].includes(lowerName)) return 'Virtualization';
                        if (['synology', 'dsm'].includes(lowerName)) return 'Storage';
                        if (['netdata', 'glances', 'homepage'].includes(lowerName)) return 'Monitoring';
                        if (['asus', 'forti', 'fortinet'].includes(lowerName)) return 'Network';
                        if (['365', 'microsoft', 'xbox'].some(term => lowerName.includes(term))) return 'Cloud';
                        return 'Other';
                    };

                    // Get icon name from URL or use app name
                    const getIconName = (app) => {
                        if (app.appearance?.iconUrl) {
                            // Extract icon name from CDN URL
                            const match = app.appearance.iconUrl.match(/\/([^\/]+)\.(?:svg|png)$/);
                            if (match) {
                                return match[1];
                            }
                        }
                        return app.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    };

                    const connection = {
                        name: app.name,
                        url: app.url,
                        iconName: getIconName(app),
                        customIconUrl: app.appearance?.iconUrl || '',
                        category: getCategory(app.name)
                    };

                    connections.push(connection);
                });
            }

            return {
                success: true,
                connections,
                total: connections.length
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid JSON format. Please check your Homarr config.'
            };
        }
    };

    const handleImport = () => {
        if (!configText.trim()) {
            toast.error('Please paste your Homarr configuration');
            return;
        }

        setIsProcessing(true);
        const results = parseHomarrConfig(configText);
        
        if (results.success) {
            setImportResults(results);
            onImport(results.connections);
            toast.success(`Successfully imported ${results.total} connections!`);
        } else {
            toast.error(results.error);
        }
        setIsProcessing(false);
    };

    const handleReset = () => {
        setConfigText('');
        setImportResults(null);
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Close</Button>
            {!importResults && (
                <Button 
                    onClick={handleImport} 
                    disabled={!configText.trim() || isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isProcessing ? 'Processing...' : 'Import Connections'}
                </Button>
            )}
            {importResults && (
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                    Import More
                </Button>
            )}
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Import Connections"
            description="Paste a configuration JSON (e.g., from Homarr) to import service connections."
            footer={footer}
            size="lg"
        >
            <div className="space-y-4">
                {!importResults ? (
                    <>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-400">Instructions</span>
                            </div>
                            <p className="text-sm text-gray-300">
                                Paste your configuration JSON below. Only service connections (name, URL, icons) will be imported - no UI changes will be made.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="config">Configuration JSON</Label>
                            <Textarea
                                id="config"
                                value={configText}
                                onChange={(e) => setConfigText(e.target.value)}
                                className="bg-gray-700 border-gray-600 mt-2 h-40 font-mono text-xs"
                                placeholder="Paste your config JSON here..."
                            />
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400">
                                <strong>What will be imported:</strong> Service name, URL, icon, and auto-detected category
                                <br />
                                <strong>What won't be imported:</strong> Widgets, layout, settings, or any UI configuration
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span className="font-medium text-emerald-400">Import Successful!</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">
                                Successfully imported {importResults.total} service connections from your Homarr config.
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <h4 className="text-sm font-semibold text-gray-200 mb-3">Imported Services:</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {importResults.connections.map((conn, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                                        <div className="w-6 h-6 flex-shrink-0">
                                            {conn.customIconUrl ? (
                                                <img src={conn.customIconUrl} alt={conn.name} className="w-6 h-6 object-contain rounded" />
                                            ) : (
                                                <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-xs">
                                                    {conn.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-200 truncate">{conn.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{conn.url}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gray-600 rounded text-gray-300">
                                            {conn.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
