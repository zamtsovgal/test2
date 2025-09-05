
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Plug, Monitor, Plus, Edit3, Trash2, Terminal, Globe, Server, Download, Upload, Type, Move } from 'lucide-react';
import { ProviderIcon } from '../components/shared/ProviderIcons';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import AddConnectionModal from '../components/connections/AddConnectionModal';
import EditConnectionModal from '../components/connections/EditConnectionModal';
import AddTextWidgetModal from '../components/connections/AddTextWidgetModal';
import EditTextWidgetModal from '../components/connections/EditTextWidgetModal';
import AddRemoteConnectionModal from '../components/connections/AddRemoteConnectionModal';
import EditRemoteConnectionModal from '../components/connections/EditRemoteConnectionModal';
import SSHConsoleModal from '../components/connections/SSHConsoleModal';
import RDPConsoleModal from '../components/connections/RDPConsoleModal';
import ImportHomarrModal from '../components/connections/ImportHomarrModal';
import ImportRdpModal from '../components/connections/ImportRdpModal';
import { ServiceConnection } from '@/api/entities';
import { TextWidget } from '@/api/entities';
import { RemoteConnection } from '@/api/entities';

export default function ConnectionsPage() {
    const [serviceConnections, setServiceConnections] = useState([]);
    const [textWidgets, setTextWidgets] = useState([]);
    const [remoteConnections, setRemoteConnections] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddTextWidgetModalOpen, setIsAddTextWidgetModalOpen] = useState(false);
    const [isEditTextWidgetModalOpen, setIsEditTextWidgetModalOpen] = useState(false);
    const [isAddRemoteModalOpen, setIsAddRemoteModalOpen] = useState(false);
    const [isEditRemoteModalOpen, setIsEditRemoteModalOpen] = useState(false);
    const [isSSHConsoleOpen, setIsSSHConsoleOpen] = useState(false);
    const [isRDPConsoleOpen, setIsRDPConsoleOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState(null);
    const [editingTextWidget, setEditingTextWidget] = useState(null);
    const [editingRemoteConnection, setEditingRemoteConnection] = useState(null);
    const [activeConnection, setActiveConnection] = useState(null);
    const [isEditMode, setIsEditMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('homebase_isEditMode');
            return savedMode ? JSON.parse(savedMode) : false;
        }
        return false;
    });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportRdpModalOpen, setIsImportRdpModalOpen] = useState(false);
    const [showServiceNames, setShowServiceNames] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedShowNames = localStorage.getItem('homebase_showServiceNames');
            return savedShowNames ? JSON.parse(savedShowNames) : true;
        }
        return true;
    });
    const [draggedItem, setDraggedItem] = useState(null);
    const [resizingItem, setResizingItem] = useState(null);
    const [pendingUpdates, setPendingUpdates] = useState(new Map());
    const saveTimeoutRef = useRef(null);
    const gridRef = useRef(null);

    const loadConnections = useCallback(async () => {
        try {
            const [services, widgets, remotes] = await Promise.all([
                ServiceConnection.list('-updated_date', 100),
                TextWidget.list('-updated_date', 100),
                RemoteConnection.list('order', 100)
            ]);
            setServiceConnections(services);
            setTextWidgets(widgets);
            setRemoteConnections(remotes);
        } catch (error) {
            console.error("Failed to load connections:", error);
            toast.error("Failed to load connections.");
        }
    }, []);

    useEffect(() => {
        loadConnections();
    }, [loadConnections]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('homebase_isEditMode', JSON.stringify(isEditMode));
        }
    }, [isEditMode]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('homebase_showServiceNames', JSON.stringify(showServiceNames));
        }
    }, [showServiceNames]);

    const debouncedSave = useCallback(async () => {
        if (pendingUpdates.size === 0) return;

        const updatesToProcess = Array.from(pendingUpdates.entries());
        setPendingUpdates(new Map());

        let allSuccessful = true;

        for (const [id, updateData] of updatesToProcess) {
            let EntityClass;
            const { itemType, ...dataToUpdate } = updateData;

            if (itemType === 'text') {
                EntityClass = TextWidget;
            } else if (itemType === 'service') {
                EntityClass = ServiceConnection;
            } else {
                console.warn(`Unknown entityType for pending update: ${itemType}`);
                continue;
            }

            try {
                await EntityClass.update(id, dataToUpdate);
                // Increased delay to prevent hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                allSuccessful = false;
                console.error(`Failed to update item ${id}:`, error);
                if (error.message && error.message.includes('429')) {
                    toast.warning(`Too many requests. Pausing updates for a moment...`);
                    // Wait longer on rate limit error before continuing
                    await new Promise(resolve => setTimeout(resolve, 2500));
                }
            }
        }

        if (allSuccessful) {
            toast.success('Layout saved successfully!');
        } else {
            toast.error("Some layout changes failed to save. Please try again in a moment.");
            // Reload to sync with the server state after a partial failure
            loadConnections();
        }
    }, [pendingUpdates, loadConnections]);

    // Effect for handling resize mouse events
    useEffect(() => {
        const handleResizeMove = (e) => {
            if (!resizingItem || !gridRef.current) return;

            const gridRect = gridRef.current.getBoundingClientRect();
            const cellWidth = gridRect.width / 12;
            const cellHeight = 140;

            const dx = e.clientX - resizingItem.startX;
            const dy = e.clientY - resizingItem.startY;

            const newW = Math.max(1, resizingItem.initialW + Math.round(dx / cellWidth));
            const newH = Math.max(1, resizingItem.initialH + Math.round(dy / cellHeight));

            if (resizingItem.itemType === 'service') {
                setServiceConnections(conns => conns.map(c =>
                    c.id === resizingItem.id ? { ...c, w: newW, h: newH } : c
                ));
            } else {
                setTextWidgets(widgets => widgets.map(w =>
                    w.id === resizingItem.id ? { ...w, w: newW, h: newH } : w
                ));
            }
        };

        const handleResizeEnd = () => {
            if (!resizingItem) return;

            let finalItem;
            if (resizingItem.itemType === 'service') {
                finalItem = serviceConnections.find(c => c.id === resizingItem.id);
            } else {
                finalItem = textWidgets.find(w => w.id === resizingItem.id);
            }

            if (finalItem) {
                setPendingUpdates(prev => new Map(prev.set(finalItem.id, {
                    ...finalItem,
                    w: finalItem.w,
                    h: finalItem.h,
                    itemType: resizingItem.itemType
                })));

                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                saveTimeoutRef.current = setTimeout(() => debouncedSave(), 1500);
            }
            setResizingItem(null);
        };

        if (resizingItem) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [resizingItem, serviceConnections, textWidgets, debouncedSave]);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const handleResizeStart = (e, item, itemType) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingItem({
            id: item.id,
            itemType,
            initialW: item.w || 1,
            initialH: item.h || 1,
            startX: e.clientX,
            startY: e.clientY,
        });
    };

    const findAvailablePosition = () => {
        const gridSize = 12;
        const occupiedPositions = new Set();

        serviceConnections.forEach(service => {
            const x = service.x || 0;
            const y = service.y || 0;
            const w = service.w || 1;
            const h = service.h || 1;

            for (let row = y; row < y + h; row++) {
                for (let col = x; col < x + w; col++) {
                    occupiedPositions.add(`${col},${row}`);
                }
            }
        });

        textWidgets.forEach(widget => {
            const x = widget.x || 0;
            const y = widget.y || 0;
            const w = widget.w || 1;
            const h = widget.h || 1;

            for (let row = y; row < y + h; row++) {
                for (let col = x; col < x + w; col++) {
                    occupiedPositions.add(`${col},${row}`);
                }
            }
        });

        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (!occupiedPositions.has(`${col},${row}`)) {
                    return { x: col, y: row };
                }
            }
        }

        return { x: 0, y: Math.floor((serviceConnections.length + textWidgets.length) / gridSize) };
    };

    const handleAddConnection = async (connectionData) => {
        try {
            const position = findAvailablePosition();
            const newConnectionData = { ...connectionData, ...position, w: connectionData.w || 2, h: connectionData.h || 1 };
            await ServiceConnection.create(newConnectionData);
            await loadConnections();
            toast.success(`Service "${connectionData.name}" added successfully!`);
        } catch (error) {
            console.error("Failed to add service connection:", error);
            if (error.message && error.message.includes('429')) {
                toast.error("Server is busy. Please wait a moment and try again.");
            } else {
                toast.error("Failed to add service connection.");
            }
        }
    };

    const handleEditConnection = async (connectionData) => {
        try {
            await ServiceConnection.update(connectionData.id, connectionData);
            await loadConnections();
            toast.success(`Service "${connectionData.name}" updated successfully!`);
        } catch (error) {
            console.error("Failed to update service connection:", error);
            if (error.message && error.message.includes('429')) {
                toast.error("Server is busy. Please wait a moment and try again.");
            } else {
                toast.error("Failed to update service connection.");
            }
        }
    };

    const handleDeleteConnection = async (id, name) => {
        if (!id) {
            console.error("Cannot delete connection: ID is undefined");
            toast.error("Cannot delete connection: Invalid ID");
            return;
        }

        try {
            await ServiceConnection.delete(id);
            await loadConnections();
            toast.success(`Service "${name}" removed successfully!`);
        } catch (error) {
            console.error("Failed to delete service connection:", error);
            if (error.message && error.message.includes('Object not found')) {
                await loadConnections();
                toast.info(`Service "${name}" was already removed.`);
            } else if (error.message && error.message.includes('429')) {
                toast.error("Server is busy. Please wait a moment and try again.");
            } else {
                toast.error(`Failed to delete service: ${error.message}`);
            }
        }
    };

    const handleAddTextWidget = async (widgetData) => {
        try {
            const position = findAvailablePosition();
            const newWidgetData = { ...widgetData, ...position, w: widgetData.w || 2, h: widgetData.h || 1 };
            await TextWidget.create(newWidgetData);
            await loadConnections();
            toast.success('Text widget added successfully!');
        } catch (error) {
            console.error("Failed to add text widget:", error);
            toast.error("Failed to add text widget.");
        }
    };

    const handleEditTextWidget = async (widgetData) => {
        try {
            await TextWidget.update(widgetData.id, widgetData);
            await loadConnections();
            toast.success('Text widget updated successfully!');
        } catch (error) {
            console.error("Failed to update text widget:", error);
            toast.error("Failed to update text widget.");
        }
    };

    const handleDeleteTextWidget = async (id) => {
        try {
            await TextWidget.delete(id);
            await loadConnections();
            toast.success('Text widget removed successfully!');
        } catch (error) {
            console.error("Failed to delete text widget:", error);
            if (error.message && error.message.includes('Object not found')) {
                await loadConnections();
                toast.info('Text widget was already removed.');
            } else {
                toast.error(`Failed to delete widget: ${error.message}`);
            }
        }
    };

    const handleItemDragStart = (e, item, itemType) => {
        if (!isEditMode) return;
        setDraggedItem({ ...item, itemType });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleGridCellDrop = async (e, gridX, gridY) => {
        e.preventDefault();
        if (!draggedItem || !isEditMode) return;

        const { itemType, id, w, h } = draggedItem;

        if (itemType === 'service') {
            const updatedConnections = serviceConnections.map(conn =>
                conn.id === id
                    ? { ...conn, x: gridX, y: gridY }
                    : conn
            );
            setServiceConnections(updatedConnections);
        } else if (itemType === 'text') {
            const updatedWidgets = textWidgets.map(widget =>
                widget.id === id
                    ? { ...widget, x: gridX, y: gridY }
                    : widget
            );
            setTextWidgets(updatedWidgets);
        }

        setPendingUpdates(prev => new Map(prev.set(id, {
            ...draggedItem,
            x: gridX,
            y: gridY,
            w: w || 1,
            h: h || 1,
            itemType: itemType
        })));

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            debouncedSave();
        }, 1500);

        const itemName = draggedItem.name || draggedItem.text || 'Item';
        toast.info(`Moved "${itemName}" to position (${gridX}, ${gridY})`);
        setDraggedItem(null);
    };

    const handleGridCellDragOver = (e) => {
        if (isEditMode) {
            e.preventDefault();
        }
    };

    const renderGrid = () => {
        const gridCols = 12;
        const gridRows = Math.max(
            ...serviceConnections.map(s => (s.y || 0) + (s.h || 1)),
            ...textWidgets.map(t => (t.y || 0) + (t.h || 1)),
            8
        );

        const gridItems = new Map();
        const occupiedPositions = new Set();

        serviceConnections.forEach(service => {
            const x = service.x || 0;
            const y = service.y || 0;
            const w = service.w || 1;
            const h = service.h || 1;
            gridItems.set(`${x},${y}`, { type: 'service', item: service });
            for (let rowIdx = y; rowIdx < y + h; rowIdx++) {
                for (let colIdx = x; colIdx < x + w; colIdx++) {
                    occupiedPositions.add(`${colIdx},${rowIdx}`);
                }
            }
        });

        textWidgets.forEach(widget => {
            const x = widget.x || 0;
            const y = widget.y || 0;
            const w = widget.w || 1;
            const h = widget.h || 1;
            gridItems.set(`${x},${y}`, { type: 'text', item: widget });
            for (let rowIdx = y; rowIdx < y + h; rowIdx++) {
                for (let colIdx = x; colIdx < x + w; colIdx++) {
                    occupiedPositions.add(`${colIdx},${rowIdx}`);
                }
            }
        });

        const renderedGridCells = [];
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const currentCoord = `${col},${row}`;
                const itemAtCoord = gridItems.get(currentCoord);

                if (itemAtCoord) {
                    const item = itemAtCoord.item;
                    const type = itemAtCoord.type;
                    const w = item.w || 1;
                    const h = item.h || 1;

                    if (type === 'service') {
                        renderedGridCells.push(
                            <div
                                key={`service-${item.id}`}
                                draggable={isEditMode && !resizingItem}
                                onDragStart={(e) => handleItemDragStart(e, item, 'service')}
                                className={`relative group rounded-3xl p-6 transition-all duration-500 ${
                                    isEditMode ? 'hover:ring-2 hover:ring-blue-500 cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                                }`}
                                style={{
                                    gridColumn: `span ${w}`,
                                    gridRow: `span ${h}`,
                                    background: 'rgba(31, 41, 55, 0.7)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(55, 65, 81, 0.5)',
                                }}
                            >
                                {isEditMode && (
                                    <>
                                        <div className="absolute top-2 right-2 flex gap-1 bg-gray-900/50 p-1 rounded-full backdrop-blur-sm">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all duration-300"
                                                onClick={(e) => { e.stopPropagation(); setEditingConnection(item); setIsEditModalOpen(true); }}
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 bg-red-600/80 hover:bg-red-500 text-white rounded-full shadow-lg transition-all duration-300"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteConnection(item.id, item.name); }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <div
                                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize flex items-center justify-center border-2 border-gray-900"
                                            onMouseDown={(e) => handleResizeStart(e, item, 'service')}
                                        />
                                    </>
                                )}

                                <a
                                    href={isEditMode ? undefined : item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center text-center h-full space-y-3 ${isEditMode ? 'opacity-80' : ''}`}
                                    onClick={(e) => { if (isEditMode) e.preventDefault(); }}
                                >
                                    <div className={`flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10 group-hover:scale-110 shadow-lg ${
                                        w > 1 || h > 1 ? 'w-20 h-20' : (showServiceNames ? 'w-16 h-16' : 'w-12 h-12')
                                    }`}>
                                        <ProviderIcon name={item.iconName} customUrl={item.customIconUrl} className={
                                            w > 1 || h > 1 ? 'w-16 h-16' : (showServiceNames ? 'w-12 h-12' : 'w-8 h-8')
                                        } />
                                    </div>
                                    {showServiceNames && (
                                        <div className="space-y-2">
                                            <p className="font-semibold text-gray-100 text-sm leading-tight">{item.name}</p>
                                            {item.subtitle && (
                                                <p className="text-xs text-gray-400 leading-tight px-2">{item.subtitle}</p>
                                            )}
                                            {!isEditMode && (
                                                <Badge variant="outline" className="text-xs border-gray-500/50 bg-gray-800/50 px-2 py-1">
                                                    {item.category}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </a>
                            </div>
                        );
                    } else if (type === 'text') {
                        renderedGridCells.push(
                            <div
                                key={`widget-${item.id}`}
                                draggable={isEditMode && !resizingItem}
                                onDragStart={(e) => handleItemDragStart(e, item, 'text')}
                                className={`relative group rounded-3xl p-4 transition-all duration-500 ${
                                    item.backgroundColor && item.backgroundColor !== 'transparent' ? item.backgroundColor : 'bg-gray-800/30'
                                } ${
                                    isEditMode ? 'hover:ring-2 hover:ring-purple-500 cursor-grab active:cursor-grabbing' : ''
                                }`}
                                style={{
                                    gridColumn: `span ${w}`,
                                    gridRow: `span ${h}`,
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(55, 65, 81, 0.3)',
                                }}
                            >
                                {isEditMode && (
                                    <>
                                        <div className="absolute top-2 right-2 flex gap-1 bg-gray-900/50 p-1 rounded-full backdrop-blur-sm">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 bg-purple-600/80 hover:bg-purple-500 text-white rounded-full shadow-lg transition-all duration-300"
                                                onClick={(e) => { e.stopPropagation(); setEditingTextWidget(item); setIsEditTextWidgetModalOpen(true); }}
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 bg-red-600/80 hover:bg-red-500 text-white rounded-full shadow-lg transition-all duration-300"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteTextWidget(item.id); }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <div
                                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full cursor-se-resize flex items-center justify-center border-2 border-gray-900"
                                            onMouseDown={(e) => handleResizeStart(e, item, 'text')}
                                        />
                                    </>
                                )}

                                <div className={`flex items-center justify-center h-full ${item.textAlign} ${isEditMode ? 'opacity-80' : ''}`}>
                                    <p className={`${item.fontSize} ${item.fontWeight} ${item.textColor} leading-tight`}>
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    }
                    col += (item.w || 1) - 1;
                } else if (!occupiedPositions.has(currentCoord)) {
                    renderedGridCells.push(
                        <div
                            key={`empty-${col}-${row}`}
                            className={`border-2 border-dashed border-transparent transition-colors ${
                                isEditMode ? 'hover:border-blue-500/50 hover:bg-blue-500/5' : ''
                            }`}
                            onDrop={(e) => handleGridCellDrop(e, col, row)}
                            onDragOver={handleGridCellDragOver}
                            style={{ minHeight: '120px' }}
                        />
                    );
                }
            }
        }
        return renderedGridCells;
    };

    // Remote connections handlers
    const handleAddRemoteConnection = async (connectionData) => {
        try {
            const newConnectionData = { ...connectionData, order: remoteConnections.length };
            await RemoteConnection.create(newConnectionData);
            await loadConnections();
            toast.success(`Remote connection "${connectionData.name}" added successfully!`);
        } catch (error) {
            console.error("Failed to add remote connection:", error);
            toast.error("Failed to add remote connection.");
        }
    };

    const handleEditRemoteConnection = async (connectionData) => {
        try {
            await RemoteConnection.update(connectionData.id, connectionData);
            await loadConnections();
            toast.success(`Remote connection "${connectionData.name}" updated successfully!`);
        } catch (error) {
            console.error("Failed to update remote connection:", error);
            toast.error("Failed to update remote connection.");
        }
    };

    const handleDeleteRemoteConnection = async (id, name) => {
        try {
            await RemoteConnection.delete(id);
            await loadConnections();
            toast.success(`Remote connection "${name}" removed successfully!`);
        } catch (error) {
            console.error("Failed to delete remote connection:", error);
            if (error.message && error.message.includes('Object not found')) {
                await loadConnections();
                toast.info(`Remote connection "${name}" was already removed.`);
            } else {
                toast.error(`Failed to delete connection: ${error.message}`);
            }
        }
    };

    const handleConnect = (connection) => {
        setActiveConnection(connection);

        if (connection.type === 'rdp') {
            setIsRDPConsoleOpen(true);
            toast.info(`Opening RDP console for ${connection.name}...`);
        } else if (connection.type === 'ssh') {
            setIsSSHConsoleOpen(true);
            toast.info(`Opening SSH console for ${connection.name}...`);
        } else if (connection.type === 'web') {
            window.open(`https://${connection.host}:${connection.port}`, '_blank');
            toast.success(`Opening web interface for ${connection.name}`);
        }
    };

    const handleDownloadRDP = (connection) => {
        const rdpContent = [
            `full address:s:${connection.host}:${connection.port}`,
            `username:s:${connection.username || ''}`,
            'prompt for credentials:i:1',
            'desktopwidth:i:1920',
            'desktopheight:i:1080',
            'session bpp:i:32',
            'screen mode id:i:2',
            'redirectclipboard:i:1',
            'redirectprinters:i:1',
            'redirectdrives:i:0',
            'redirectsmartcards:i:1',
            'displayconnectionbar:i:1',
            'autoreconnection enabled:i:1',
            'alternate shell:s:',
            'shell working directory:s:',
            'authentication level:i:2',
            'connect to console:i:0',
            'gatewayusagemethod:i:0',
            'disable wallpaper:i:1',
            'disable full window drag:i:1',
            'disable menu anims:i:1',
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

    const getConnectionTypeIcon = (type) => {
        switch (type) {
            case 'rdp': return <Monitor className="w-4 h-4" />;
            case 'ssh': return <Terminal className="w-4 h-4" />;
            case 'web': return <Globe className="w-4 h-4" />;
            default: return <Server className="w-4 h-4" />;
        }
    };

    const getOSIcon = (os) => {
        switch (os) {
            case 'windows': return '🪟';
            case 'linux': return '🐧';
            case 'appliance': return '⚙️';
            default: return '💻';
        }
    };

    const handleImportConnections = async (connections) => {
        try {
            const connectionsWithPositions = connections.map((conn) => {
                const position = findAvailablePosition();
                return { ...conn, ...position };
            });

            if (connectionsWithPositions.length > 0) {
                await ServiceConnection.bulkCreate(connectionsWithPositions);
            }

            await loadConnections();
            setIsImportModalOpen(false);
            toast.success(`Added ${connections.length} connections from Homarr!`);
        } catch (error) {
            console.error("Failed to import connections:", error);
            toast.error("Failed to import connections.");
        }
    };

    const handleExportServices = () => {
        const exportData = {
            services: serviceConnections.map(({ id, created_date, updated_date, created_by, ...rest }) => rest)
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'homebase-services-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Services exported successfully!');
    };

    const handleExportRemoteConnections = () => {
        const exportData = {
            remoteConnections: remoteConnections.map(({ id, created_date, updated_date, created_by, ...rest }) => rest)
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'homebase-remote-connections-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Remote connections exported successfully!');
    };

    const handleExportTextWidgets = () => {
        const exportData = {
            textWidgets: textWidgets.map(({ id, created_date, updated_date, created_by, ...rest }) => rest)
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'homebase-text-widgets-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Text widgets exported successfully!');
    };

    const handleExportAll = () => {
        const exportData = {
            serviceConnections: serviceConnections.map(({ id, created_date, updated_date, created_by, ...rest }) => rest),
            remoteConnections: remoteConnections.map(({ id, created_date, updated_date, created_by, ...rest }) => rest),
            textWidgets: textWidgets.map(({ id, created_date, updated_date, created_by, ...rest }) => rest),
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'homebase-complete-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Complete configuration exported successfully!');
    };

    const handleImportRdpFiles = async (rdpConnections) => {
        try {
            const newConnections = rdpConnections.map((conn, index) => ({
                ...conn,
                order: remoteConnections.length + index
            }));

            if (newConnections.length > 0) {
                await RemoteConnection.bulkCreate(newConnections);
            }

            await loadConnections();
            setIsImportRdpModalOpen(false);
            toast.success(`Added ${rdpConnections.length} RDP connections!`);
        } catch (error) {
            console.error("Failed to import RDP connections:", error);
            toast.error(`Failed to import RDP connections: ${error.message}`);
        }
    };

    return (
        <>
            <AddConnectionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddConnection} />
            <EditConnectionModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditConnection} connection={editingConnection} />
            <AddTextWidgetModal isOpen={isAddTextWidgetModalOpen} onClose={() => setIsAddTextWidgetModalOpen(false)} onSave={handleAddTextWidget} />
            <EditTextWidgetModal isOpen={isEditTextWidgetModalOpen} onClose={() => setIsEditTextWidgetModalOpen(false)} onSave={handleEditTextWidget} widget={editingTextWidget} />
            <AddRemoteConnectionModal isOpen={isAddRemoteModalOpen} onClose={() => setIsAddRemoteModalOpen(false)} onSave={handleAddRemoteConnection} />
            <EditRemoteConnectionModal isOpen={isEditRemoteModalOpen} onClose={() => setIsEditRemoteModalOpen(false)} onSave={handleEditRemoteConnection} connection={editingRemoteConnection} />
            <SSHConsoleModal isOpen={isSSHConsoleOpen} onClose={() => setIsSSHConsoleOpen(false)} connection={activeConnection} />
            <RDPConsoleModal isOpen={isRDPConsoleOpen} onClose={() => setIsRDPConsoleOpen(false)} connection={activeConnection} />
            <ImportHomarrModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportConnections}
            />
            <ImportRdpModal
                isOpen={isImportRdpModalOpen}
                onClose={() => setIsImportRdpModalOpen(false)}
                onImport={handleImportRdpFiles}
            />

            <div className="min-h-screen bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div
                        className="w-full h-full opacity-30"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
                                radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
                                radial-gradient(circle at 50px 100px, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px, 100px 100px, 100px 100px',
                            animation: 'drift 30s infinite linear'
                        }}
                    />
                </div>

                <style>
                    {`
                        @keyframes drift {
                            0% { transform: translate(0px, 0px) rotate(0deg); }
                            33% { transform: translate(30px, -30px) rotate(120deg); }
                            66% { transform: translate(-20px, 20px) rotate(240deg); }
                            100% { transform: translate(0px, 0px) rotate(360deg); }
                        }
                    `}
                </style>

                <div className="relative z-10 p-6 space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-3">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                                Connection Hub
                            </h1>
                            <p className="text-gray-300 text-xl">Your centralized homelab dashboard</p>
                        </div>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 bg-gray-800 border-gray-700">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none text-gray-100">Add New</h4>
                                            <p className="text-sm text-gray-400">Add a new connection or item to your hub.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Button variant="ghost" onClick={() => { setIsAddModalOpen(true); }} className="justify-start">Add Service</Button>
                                            <Button variant="ghost" onClick={() => { setIsAddRemoteModalOpen(true); }} className="justify-start">Add Remote Connection</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 bg-gray-800 border-gray-700">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none text-gray-100">Settings & Configuration</h4>
                                            <p className="text-sm text-gray-400">Customize appearance and manage your data.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <h5 className="text-sm font-medium text-gray-200">Display Options</h5>
                                            <div className="grid gap-3">
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="edit-mode" className="text-gray-300 text-sm">Customize Layout</Label>
                                                    <Switch id="edit-mode" checked={isEditMode} onCheckedChange={setIsEditMode} />
                                                </div>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="show-names" className="text-gray-300 text-sm">Show Service Names</Label>
                                                    <Switch id="show-names" checked={showServiceNames} onCheckedChange={setShowServiceNames} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-700 pt-3">
                                             <h5 className="text-sm font-medium text-gray-200 mb-3">Add Content</h5>
                                             <div className="grid gap-2">
                                                 <Button variant="ghost" onClick={() => setIsAddTextWidgetModalOpen(true)} className="justify-start h-8 text-sm">
                                                     <Type className="w-3 h-3 mr-2" />
                                                     Add Text Widget
                                                 </Button>
                                             </div>
                                        </div>

                                        <div className="border-t border-gray-700 pt-3">
                                            <h5 className="text-sm font-medium text-gray-200 mb-3">Import & Export</h5>
                                            <div className="grid gap-2">
                                                <Button variant="ghost" onClick={() => setIsImportModalOpen(true)} className="justify-start h-8 text-sm">
                                                    <Upload className="w-3 h-3 mr-2" />
                                                    Import Configuration
                                                </Button>
                                                <Button variant="ghost" onClick={() => setIsImportRdpModalOpen(true)} className="justify-start h-8 text-sm">
                                                    <Monitor className="w-3 h-3 mr-2" />
                                                    Import RDP/RDS Files
                                                </Button>
                                                <Button variant="ghost" onClick={handleExportAll} className="justify-start h-8 text-sm">
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Export All
                                                </Button>
                                                <Button variant="ghost" onClick={handleExportServices} className="justify-start h-8 text-sm">
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Export Services Only
                                                </Button>
                                                <Button variant="ghost" onClick={handleExportRemoteConnections} className="justify-start h-8 text-sm">
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Export Remote Connections
                                                </Button>
                                                <Button variant="ghost" onClick={handleExportTextWidgets} className="justify-start h-8 text-sm">
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Export Text Widgets
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Tabs defaultValue="services" className="space-y-8">
                        <div className="flex justify-between items-center">
                            <TabsList className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 p-1.5 rounded-2xl shadow-2xl">
                                <TabsTrigger
                                    value="services"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-xl transition-all duration-300 px-6 py-3"
                                >
                                    <Plug className="w-4 h-4 mr-2" />
                                    Web Services
                                </TabsTrigger>
                                <TabsTrigger
                                    value="remote"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 rounded-xl transition-all duration-300 px-6 py-3"
                                >
                                    <Monitor className="w-4 h-4 mr-2" />
                                    Remote Access
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="services" className="space-y-8">
                            {isEditMode && (
                                <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg text-right">
                                    <strong>Edit Mode:</strong> Drag items to reposition them. Resize items by dragging the bottom-right corner. Changes save automatically.
                                    {pendingUpdates.size > 0 && (
                                        <span className="ml-2 text-yellow-400">
                                            • {pendingUpdates.size} pending change{pendingUpdates.size !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div
                                ref={gridRef}
                                className="grid grid-cols-12 gap-4"
                                style={{ gridAutoRows: 'minmax(120px, auto)' }}
                            >
                                {renderGrid()}
                            </div>
                        </TabsContent>

                        <TabsContent value="remote" className="space-y-8">
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setIsAddRemoteModalOpen(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Remote Connection
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {remoteConnections.map((connection, index) => (
                                    <motion.div
                                        key={connection.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-gray-700/70 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="text-4xl">{getOSIcon(connection.os)}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="font-semibold text-gray-100 text-xl">{connection.name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            {getConnectionTypeIcon(connection.type)}
                                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 uppercase text-xs font-semibold px-3 py-1">
                                                                {connection.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400">
                                                        <div><span className="text-gray-500 font-medium">Host:</span> {connection.host}:{connection.port}</div>
                                                        <div><span className="text-gray-500 font-medium">User:</span> {connection.username}</div>
                                                        <div><span className="text-gray-500 font-medium">Info:</span> {connection.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {isEditMode ? (
                                                    <div className="flex gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-gray-600 hover:bg-gray-700 shadow-md shadow-gray-500/10"
                                                            onClick={() => {
                                                                setEditingRemoteConnection(connection);
                                                                setIsEditRemoteModalOpen(true);
                                                            }}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-600 text-red-400 hover:bg-red-600/10 shadow-md shadow-red-500/10"
                                                            onClick={() => handleDeleteRemoteConnection(connection.id, connection.name)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        {connection.type === 'rdp' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-blue-600 text-blue-400 hover:bg-blue-600/10 shadow-md shadow-blue-500/10"
                                                                onClick={() => handleDownloadRDP(connection)}
                                                            >
                                                                <Download className="w-4 h-4 mr-2" />
                                                                RDP File
                                                            </Button>
                                                        )}
                                                        <Button
                                                            onClick={() => handleConnect(connection)}
                                                            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 transition-all duration-300 px-4"
                                                        >
                                                            {getConnectionTypeIcon(connection.type)}
                                                            <span className="ml-2 font-semibold">Console</span>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
