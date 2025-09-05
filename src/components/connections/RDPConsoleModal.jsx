
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Maximize2, Minimize2, Download, Settings, Wifi, WifiOff, Play, Square, RotateCw, Volume2, Keyboard, Mouse, Clipboard, Copy, X } from 'lucide-react';
import { toast } from "sonner";

export default function RDPConsoleModal({ isOpen, onClose, connection }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [showSettings, setShowSettings] = useState(false);
    const [clipboard, setClipboard] = useState('');
    const [rdpSettings, setRdpSettings] = useState({
        resolution: '1920x1080',
        colorDepth: '32',
        audio: 'local',
        clipboard: true,
        drives: false,
        printers: false,
        smartCards: false,
        compression: true,
        encryption: 'auto',
        authentication: 'any'
    });

    useEffect(() => {
        if (isOpen && connection) {
            // Simulate RDP connection process
            setConnectionStatus('connecting');
            toast.info(`Connecting to ${connection.name}...`);
            
            setTimeout(() => {
                setConnectionStatus('connected');
                setIsConnected(true);
                toast.success(`Connected to ${connection.name}`);
            }, 3000);
        } else {
            setConnectionStatus('disconnected');
            setIsConnected(false);
        }
    }, [isOpen, connection]);

    const downloadRdpFile = () => {
        if (!connection) return;
        
        const rdpContent = [
            `full address:s:${connection.host}:${connection.port}`,
            `username:s:${connection.username || ''}`,
            'prompt for credentials:i:1',
            `desktopwidth:i:${rdpSettings.resolution.split('x')[0]}`,
            `desktopheight:i:${rdpSettings.resolution.split('x')[1]}`,
            `session bpp:i:${rdpSettings.colorDepth}`,
            'screen mode id:i:2',
            `redirectclipboard:i:${rdpSettings.clipboard ? '1' : '0'}`,
            `redirectprinters:i:${rdpSettings.printers ? '1' : '0'}`,
            `redirectdrives:i:${rdpSettings.drives ? '1' : '0'}`,
            `redirectsmartcards:i:${rdpSettings.smartCards ? '1' : '0'}`,
            'displayconnectionbar:i:1',
            'autoreconnection enabled:i:1',
            'alternate shell:s:',
            'shell working directory:s:',
            'authentication level:i:2',
            'connect to console:i:0',
            'gatewayusagemethod:i:0',
            `disable wallpaper:i:${rdpSettings.compression ? '1' : '0'}`,
            `disable full window drag:i:${rdpSettings.compression ? '1' : '0'}`,
            `disable menu anims:i:${rdpSettings.compression ? '1' : '0'}`,
            'disable themes:i:0',
            'bitmapcachepersistenable:i:1',
            'audiomode:i:0',
            'keyboardhook:i:2'
        ].join('\r\n');

        const blob = new Blob([rdpContent], { type: 'application/rdp' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${connection.name.replace(/\s+/g, '_')}.rdp`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`RDP file downloaded for ${connection.name}`);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(clipboard);
            toast.success('Copied to remote clipboard');
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setClipboard(text);
            toast.success('Pasted from clipboard - will be sent to remote session');
        } catch (err) {
            toast.error('Failed to paste from clipboard');
        }
    };

    const takeScreenshot = () => {
        toast.success('Screenshot saved to Downloads');
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        toast.info(isFullscreen ? 'Exited fullscreen mode' : 'Entered fullscreen mode');
    };

    const handleConnect = () => {
        if (connectionStatus === 'disconnected') {
            setConnectionStatus('connecting');
            setTimeout(() => {
                setConnectionStatus('connected');
                setIsConnected(true);
            }, 3000);
        }
    };

    const handleDisconnect = () => {
        setConnectionStatus('disconnecting');
        setTimeout(() => {
            setConnectionStatus('disconnected');
            setIsConnected(false);
        }, 1000);
    };

    const sendCtrlAltDel = () => {
        if (isConnected) {
            toast.info('Ctrl+Alt+Del sent to remote session');
        }
    };

    if (!connection) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 text-gray-100 p-0 flex flex-col shadow-2xl ${
                isFullscreen ? 'w-screen h-screen max-w-none m-0 rounded-none' : 'max-w-[95vw] h-[90vh] rounded-2xl'
            }`}>
                {/* Modern Header with Glass Effect */}
                <div className="bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/30 shrink-0 rounded-t-2xl">
                    {/* Title Bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/20">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Monitor className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-100">{connection.name}</h2>
                                    <p className="text-sm text-gray-400">Remote Desktop Connection</p>
                                </div>
                            </div>
                            <Badge className={`text-xs px-3 py-1.5 font-medium ${
                                connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' :
                                connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                                connectionStatus === 'disconnecting' ? 'bg-orange-500/20 text-orange-400 border-orange-400/30' :
                                'bg-red-500/20 text-red-400 border-red-400/30'
                            }`}>
                                {connectionStatus === 'connected' && <Wifi className="w-3 h-3 mr-1.5" />}
                                {connectionStatus === 'disconnected' && <WifiOff className="w-3 h-3 mr-1.5" />}
                                {connectionStatus === 'connecting' && <RotateCw className="w-3 h-3 mr-1.5 animate-spin" />}
                                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                            </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setShowSettings(!showSettings)} className="h-9 px-3 text-gray-300 hover:bg-gray-700/50" title="Settings">
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={copyToClipboard} className="h-9 px-3 text-gray-300 hover:bg-gray-700/50" title="Copy to clipboard" disabled={!isConnected}>
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={downloadRdpFile} className="h-9 px-3 text-gray-300 hover:bg-gray-700/50" title="Download RDP file">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="h-9 px-3 text-gray-300 hover:bg-gray-700/50" title="Toggle fullscreen">
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={onClose} className="h-9 px-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400" title="Close">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Control Bar */}
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4">
                            {connectionStatus === 'disconnected' ? (
                                <Button size="sm" onClick={handleConnect} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg h-9 px-4">
                                    <Play className="w-4 h-4 mr-2" />
                                    Connect
                                </Button>
                            ) : (
                                <Button size="sm" onClick={handleDisconnect} variant="outline" className="border-red-600/50 text-red-400 hover:bg-red-500/20 h-9 px-4">
                                    <Square className="w-4 h-4 mr-2" />
                                    Disconnect
                                </Button>
                            )}
                            
                            {isConnected && (
                                <>
                                    <Button size="sm" onClick={sendCtrlAltDel} variant="outline" className="border-gray-600 hover:bg-gray-700/50 h-9 px-4">
                                        <Keyboard className="w-4 h-4 mr-2" />
                                        Ctrl+Alt+Del
                                    </Button>
                                    <Button size="sm" onClick={takeScreenshot} variant="outline" className="border-gray-600 hover:bg-gray-700/50 h-9 px-4">
                                        <Download className="w-4 h-4 mr-2" />
                                        Screenshot
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={pasteFromClipboard} className="h-9 px-3 text-gray-300 hover:bg-gray-700/50" title="Paste from clipboard" disabled={!isConnected}>
                                        <Clipboard className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span>{rdpSettings.resolution}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4" />
                                <span>{rdpSettings.audio}</span>
                            </div>
                            <span className="font-mono">{connection.host}:{connection.port}</span>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="bg-gray-800/40 backdrop-blur-sm p-6 border-t border-gray-700/30 mx-6 mb-4 rounded-xl">
                            <h3 className="text-sm font-semibold text-gray-200 mb-4">RDP Connection Settings</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <Label>Resolution</Label>
                                    <Select value={rdpSettings.resolution} onValueChange={(value) => setRdpSettings(prev => ({...prev, resolution: value}))}>
                                        <SelectTrigger className="bg-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1920x1080">1920x1080</SelectItem>
                                            <SelectItem value="1366x768">1366x768</SelectItem>
                                            <SelectItem value="1280x720">1280x720</SelectItem>
                                            <SelectItem value="1024x768">1024x768</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Color Depth</Label>
                                    <Select value={rdpSettings.colorDepth} onValueChange={(value) => setRdpSettings(prev => ({...prev, colorDepth: value}))}>
                                        <SelectTrigger className="bg-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="32">32-bit</SelectItem>
                                            <SelectItem value="24">24-bit</SelectItem>
                                            <SelectItem value="16">16-bit</SelectItem>
                                            <SelectItem value="15">15-bit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Audio</Label>
                                    <Select value={rdpSettings.audio} onValueChange={(value) => setRdpSettings(prev => ({...prev, audio: value}))}>
                                        <SelectTrigger className="bg-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="local">Play on this computer</SelectItem>
                                            <SelectItem value="remote">Play on remote computer</SelectItem>
                                            <SelectItem value="none">Do not play</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Authentication</Label>
                                    <Select value={rdpSettings.authentication} onValueChange={(value) => setRdpSettings(prev => ({...prev, authentication: value}))}>
                                        <SelectTrigger className="bg-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any authentication</SelectItem>
                                            <SelectItem value="required">Require authentication</SelectItem>
                                            <SelectItem value="negotiate">Negotiate authentication</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={rdpSettings.clipboard}
                                        onChange={(e) => setRdpSettings(prev => ({...prev, clipboard: e.target.checked}))}
                                        className="rounded bg-gray-700"
                                    />
                                    Clipboard
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={rdpSettings.drives}
                                        onChange={(e) => setRdpSettings(prev => ({...prev, drives: e.target.checked}))}
                                        className="rounded bg-gray-700"
                                    />
                                    Drives
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={rdpSettings.printers}
                                        onChange={(e) => setRdpSettings(prev => ({...prev, printers: e.target.checked}))}
                                        className="rounded bg-gray-700"
                                    />
                                    Printers
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="checkbox" 
                                        checked={rdpSettings.compression}
                                        onChange={(e) => setRdpSettings(prev => ({...prev, compression: e.target.checked}))}
                                        className="rounded bg-gray-700"
                                    />
                                    Compression
                                </label>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Main RDP Display Area with Modern Glass Effect */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900/50 to-black/80 relative overflow-hidden">
                    <div className="flex-1 relative overflow-hidden rounded-b-2xl">
                        {connectionStatus === 'connecting' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
                                    <p className="text-gray-200 text-xl font-medium">Establishing RDP connection...</p>
                                    <p className="text-sm text-gray-400 mt-3">Connecting to {connection.host}:{connection.port}</p>
                                    <div className="mt-6 bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 text-xs text-gray-400 max-w-md mx-auto">
                                        <div className="space-y-2">
                                            <div>• Negotiating connection parameters</div>
                                            <div>• Authenticating with credentials</div>
                                            <div>• Initializing remote desktop session</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {connectionStatus === 'connected' && (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-700/30 relative overflow-hidden flex items-center justify-center backdrop-blur-sm">
                                <div className="text-center text-white bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                                    <Monitor className="w-20 h-20 mx-auto mb-4 opacity-60" />
                                    <p className="text-2xl font-semibold mb-3">RDP Session Active</p>
                                    <p className="text-lg text-blue-200">Connected to {connection.name}</p>
                                    <p className="text-sm mt-3 opacity-70">Resolution: {rdpSettings.resolution} • Color: {rdpSettings.colorDepth}-bit</p>
                                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clipboard className="w-4 h-4" />
                                            <span>Clipboard {rdpSettings.clipboard ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="w-4 h-4" />
                                            <span>Audio {rdpSettings.audio}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {connectionStatus === 'disconnected' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                                <div className="text-center text-gray-300">
                                    <WifiOff className="w-20 h-20 mx-auto mb-6 text-gray-500" />
                                    <p className="text-xl font-semibold">Not Connected</p>
                                    <p className="text-sm mt-3 text-gray-400">Click connect to establish RDP session with {connection.name}</p>
                                    <div className="mt-6 bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 text-left text-sm max-w-md mx-auto">
                                        <div className="text-gray-200 font-semibold mb-3">Connection Details:</div>
                                        <div className="space-y-1 text-gray-400">
                                            <div>Host: <span className="font-mono text-gray-300">{connection.host}</span></div>
                                            <div>Port: <span className="font-mono text-gray-300">{connection.port}</span></div>
                                            <div>User: <span className="text-gray-300">{connection.username || 'Not specified'}</span></div>
                                            <div>OS: <span className="text-gray-300">{connection.os}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Modern Status Bar */}
                    <div className="bg-gray-800/40 backdrop-blur-sm px-6 py-2 text-xs text-gray-400 border-t border-gray-700/30 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-8">
                                <div>Status: <span className="text-gray-300">{connectionStatus}</span></div>
                                <div>Latency: <span className="text-gray-300">{isConnected ? '12ms' : 'N/A'}</span></div>
                                <div>Bandwidth: <span className="text-gray-300">{isConnected ? '2.1 Mbps' : 'N/A'}</span></div>
                                <div>Session: <span className="text-gray-300">{isConnected ? `${Math.floor(Math.random() * 60) + 1} min` : 'N/A'}</span></div>
                            </div>
                            <div className="flex gap-6">
                                <div>Protocol: <span className="text-gray-300">RDP 8.1</span></div>
                                <div>Encryption: <span className="text-gray-300">{rdpSettings.encryption}</span></div>
                                <div>Compression: <span className="text-gray-300">{rdpSettings.compression ? 'On' : 'Off'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper components for desktop simulation
const FolderIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
);

const ComputerIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const NetworkIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
);
