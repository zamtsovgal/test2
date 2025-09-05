import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, AlertCircle, Monitor } from 'lucide-react';
import { toast } from "sonner";

export default function ImportRdpModal({ isOpen, onClose, onImport }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [importResults, setImportResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const parseRdpFile = (fileContent, fileName) => {
        try {
            const connection = {
                name: fileName.replace('.rdp', '').replace('.rds', ''),
                type: 'rdp',
                os: 'windows',
                port: 3389,
                host: '',
                username: '',
                password: '',
                domain: '',
                description: 'Imported from ' + fileName
            };

            const lines = fileContent.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line && line.includes && line.includes('full address:s:')) {
                    const parts = line.split('full address:s:');
                    if (parts && parts.length > 1 && parts[1]) {
                        const hostPort = parts[1].split(':');
                        if (hostPort && hostPort[0]) {
                            connection.host = hostPort[0];
                        }
                    }
                }
            }

            return connection.host ? connection : null;
        } catch (e) {
            return null;
        }
    };

    const parseRdmFile = (fileContent, fileName) => {
        try {
            const connections = [];
            const lines = fileContent.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line && line.includes && line.includes('<Name>') && line.includes('</Name>')) {
                    const name = line.replace('<Name>', '').replace('</Name>', '').trim();
                    if (name) {
                        const connection = {
                            name: name,
                            type: 'rdp',
                            os: 'windows',
                            port: 3389,
                            host: '',
                            username: '',
                            password: '',
                            domain: '',
                            description: 'Imported from ' + fileName
                        };
                        
                        // Look for host in next few lines
                        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                            const nextLine = lines[j];
                            if (nextLine && nextLine.includes && nextLine.includes('<Host>') && nextLine.includes('</Host>')) {
                                const host = nextLine.replace('<Host>', '').replace('</Host>', '').trim();
                                if (host) {
                                    connection.host = host;
                                    connections.push(connection);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            return connections;
        } catch (e) {
            return [];
        }
    };
    
    const handleFileSelect = (event) => {
        try {
            const files = Array.from(event.target.files || []);
            setSelectedFiles(files);
        } catch (e) {
            toast.error('Error selecting files');
        }
    };

    const handleImport = async () => {
        try {
            if (!selectedFiles || selectedFiles.length === 0) {
                toast.error('Please select files to import');
                return;
            }

            setIsProcessing(true);
            const allConnections = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    const content = await file.text();
                    const fileName = file.name || 'unknown';
                    
                    if (fileName.endsWith('.rdm') || fileName.endsWith('.xml')) {
                        const rdmConnections = parseRdmFile(content, fileName);
                        if (rdmConnections && rdmConnections.length > 0) {
                            for (let j = 0; j < rdmConnections.length; j++) {
                                allConnections.push(rdmConnections[j]);
                            }
                        }
                    } else {
                        const rdpConnection = parseRdpFile(content, fileName);
                        if (rdpConnection) {
                            allConnections.push(rdpConnection);
                        }
                    }
                } catch (error) {
                    console.log('Error processing file');
                }
            }

            if (allConnections.length > 0) {
                setImportResults({ success: true, connections: allConnections, total: allConnections.length });
                onImport(allConnections);
                toast.success('Successfully imported ' + allConnections.length + ' connections!');
            } else {
                toast.error('No valid connections found in files.');
                setImportResults({ success: false, error: 'No valid connections found' });
            }
            
            setIsProcessing(false);
        } catch (e) {
            setIsProcessing(false);
            toast.error('Import failed');
        }
    };

    const handleReset = () => {
        setSelectedFiles([]);
        setImportResults(null);
    };

    const footer = (
        <>
            <Button variant="outline" onClick={onClose}>Close</Button>
            {!importResults && (
                <Button 
                    onClick={handleImport} 
                    disabled={!selectedFiles || selectedFiles.length === 0 || isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isProcessing ? 'Processing...' : 'Import Files'}
                </Button>
            )}
            {importResults && (
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                    Import More Files
                </Button>
            )}
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Import RDP/RDM Files"
            description="Select files exported from Remote Desktop Manager or individual RDP files."
            footer={footer}
            size="lg"
        >
            <div className="space-y-4">
                {!importResults ? (
                    <>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Monitor className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-400">RDP File Import</span>
                            </div>
                            <p className="text-sm text-gray-300">
                                Import RDP connections from Remote Desktop Manager exports or individual .rdp files.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="rdp-files">Select Files</Label>
                            <Input
                                id="rdp-files"
                                type="file"
                                multiple
                                accept=".rdm,.xml,.rdp,.rds"
                                onChange={handleFileSelect}
                                className="bg-gray-700 border-gray-600 mt-2"
                            />
                        </div>

                        {selectedFiles && selectedFiles.length > 0 && (
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-200 mb-3">Selected Files ({selectedFiles.length})</h4>
                                <div className="grid gap-2 max-h-32 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                                            <Monitor className="w-4 h-4 text-emerald-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 truncate">{file.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-400">
                                                    {file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown size'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span className="font-medium text-emerald-400">Import Complete!</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">
                                Successfully imported {importResults.total} RDP connections
                            </p>
                        </div>

                        {importResults.connections && importResults.connections.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                                <h4 className="text-sm font-semibold text-gray-200 mb-3">Imported Connections:</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {importResults.connections.map((conn, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                                            <Monitor className="w-5 h-5 text-emerald-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 truncate">{conn.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-400">
                                                    {conn.host || 'No host'}:{conn.port || 3389}
                                                </p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded">
                                                RDP
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}