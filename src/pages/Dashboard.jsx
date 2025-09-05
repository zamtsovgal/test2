
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Server } from "@/api/entities";
import { DashboardWidget } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Activity, Server as ServerIcon, HardDrive, Container, Zap, AlertTriangle, CheckCircle, Settings, Edit3, Trash2, Move } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import SystemOverview from "../components/dashboard/SystemOverview";
import ServerStatusGrid from "../components/dashboard/ServerStatusGrid";
import ResourceMonitor from "../components/dashboard/ResourceMonitor";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import SystemOverviewTimelineModal from "../components/dashboard/SystemOverviewTimelineModal";
import DashboardMetricModal from "../components/dashboard/DashboardMetricModal";
import DashboardServerModal from "../components/dashboard/DashboardServerModal";
import HostControlPanelModal from "../components/esxi/HostControlPanelModal";

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalServers: 0,
    onlineServers: 0,
    totalVMs: 0,
    totalContainers: 0,
    storageUsed: 0,
    totalStorage: 0
  });
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isSystemOverviewModalOpen, setIsSystemOverviewModalOpen] = useState(false);
  const [isDashboardMetricModalOpen, setIsDashboardMetricModalOpen] = useState(false);
  const [isDashboardServerModalOpen, setIsDashboardServerModalOpen] = useState(false);
  const [isHostControlPanelOpen, setIsHostControlPanelOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  
  // Layout customization state
  const [isEditMode, setIsEditMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('dashboard_isEditMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [resizingItem, setResizingItem] = useState(null);
  const [pendingUpdates, setPendingUpdates] = new Map();
  const saveTimeoutRef = useRef(null);
  const gridRef = useRef(null);

  // Default dashboard widgets layout - adjusted for better flexibility
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'servers', type: 'servers', x: 0, y: 0, w: 1, h: 1 },
    { id: 'vms', type: 'vms', x: 1, y: 0, w: 1, h: 1 },
    { id: 'containers', type: 'containers', x: 2, y: 0, w: 1, h: 1 },
    { id: 'storage', type: 'storage', x: 3, y: 0, w: 1, h: 1 },
    { id: 'system-overview', type: 'system-overview', x: 0, y: 1, w: 3, h: 2 },
    { id: 'resource-monitor', type: 'resource-monitor', x: 3, y: 1, w: 1, h: 2 },
    { id: 'server-status', type: 'server-status', x: 0, y: 3, w: 2, h: 2 },
    { id: 'recent-alerts', type: 'recent-alerts', x: 2, y: 3, w: 2, h: 2 },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_isEditMode', JSON.stringify(isEditMode));
    }
  }, [isEditMode]);

  const loadDashboardData = async () => {
    const [serverData, widgetData] = await Promise.all([
      Server.list(),
      DashboardWidget.filter({ enabled: true }, "order")
    ]);
    
    setServers(serverData);
    setWidgets(widgetData);
    
    // Calculate system stats
    const onlineCount = serverData.filter(s => s.status === 'online').length;
    setSystemStats({
      totalServers: serverData.length,
      onlineServers: onlineCount,
      totalVMs: Math.floor(Math.random() * 25) + 10,
      totalContainers: Math.floor(Math.random() * 15) + 8,
      storageUsed: Math.floor(Math.random() * 800) + 200,
      totalStorage: 1000
    });
  };

  const debouncedSave = useCallback(async () => {
    if (pendingUpdates.size === 0) return;

    const updatesToProcess = Array.from(pendingUpdates.entries());
    setPendingUpdates(new Map());

    // Save layout to localStorage for now
    const layoutData = dashboardWidgets.map(widget => ({
      id: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h
    }));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_layout', JSON.stringify(layoutData));
    }

    toast.success('Dashboard layout saved!');
  }, [pendingUpdates, dashboardWidgets, setPendingUpdates]);

  // Effect for handling resize mouse events - improved for smoother resizing
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!resizingItem || !gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const cellWidth = gridRect.width / 6; // Increased grid granularity
      const cellHeight = 150; // Smaller cell height for better control

      const dx = e.clientX - resizingItem.startX;
      const dy = e.clientY - resizingItem.startY;

      const newW = Math.max(1, Math.min(6, resizingItem.initialW + Math.round(dx / cellWidth))); // Max 6 columns
      const newH = Math.max(1, Math.min(4, resizingItem.initialH + Math.round(dy / cellHeight))); // Max 4 rows height

      setDashboardWidgets(widgets => widgets.map(w =>
        w.id === resizingItem.id ? { ...w, w: newW, h: newH } : w
      ));
    };

    const handleResizeEnd = () => {
      if (!resizingItem) return;

      const finalWidget = dashboardWidgets.find(w => w.id === resizingItem.id);

      if (finalWidget) {
        setPendingUpdates(prev => {
          const newMap = new Map(prev);
          newMap.set(finalWidget.id, finalWidget);
          return newMap;
        });

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
  }, [resizingItem, dashboardWidgets, debouncedSave, setPendingUpdates, setResizingItem]);

  useEffect(() => {
    // Load saved layout on mount
    if (typeof window !== 'undefined') {
      const savedLayout = localStorage.getItem('dashboard_layout');
      if (savedLayout) {
        try {
          const layoutData = JSON.parse(savedLayout);
          setDashboardWidgets(current => current.map(widget => {
            const saved = layoutData.find(l => l.id === widget.id);
            return saved ? { ...widget, ...saved } : widget;
          }));
        } catch (error) {
          console.error('Failed to load dashboard layout:', error);
        }
      }
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleResizeStart = (e, widget) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingItem({
      id: widget.id,
      initialW: widget.w,
      initialH: widget.h,
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  const handleWidgetDragStart = (e, widget) => {
    if (!isEditMode) return;
    setDraggedItem(widget);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleGridCellDrop = async (e, gridX, gridY) => {
    e.preventDefault();
    if (!draggedItem || !isEditMode) return;

    const updatedWidgets = dashboardWidgets.map(widget =>
      widget.id === draggedItem.id
        ? { ...widget, x: gridX, y: gridY }
        : widget
    );
    setDashboardWidgets(updatedWidgets);

    setPendingUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(draggedItem.id, { ...draggedItem, x: gridX, y: gridY });
      return newMap;
    });

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 1500);

    toast.info(`Moved widget to position (${gridX}, ${gridY})`);
    setDraggedItem(null);
  };

  const handleGridCellDragOver = (e) => {
    if (isEditMode) {
      e.preventDefault();
    }
  };

  const handleMetricClick = (metricType) => {
    if (isEditMode) return; // Don't open modals in edit mode
    setSelectedMetric(metricType);
    if (metricType === 'servers') {
      setIsDashboardServerModalOpen(true);
    } else {
      setIsDashboardMetricModalOpen(true);
    }
  };

  const handleHostClick = (host) => {
    if (isEditMode) return; // Don't open modals in edit mode
    setSelectedHost(host);
    setIsHostControlPanelOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      online: "text-emerald-400 bg-emerald-400/20",
      offline: "text-red-400 bg-red-400/20",
      warning: "text-yellow-400 bg-yellow-400/20",
      error: "text-red-500 bg-red-500/20"
    };
    return colors[status] || colors.offline;
  };

  // Helper function to get responsive Tailwind class names
  const getWidgetClassNames = (widget) => {
    let headerPadding, contentPadding;
    let titleTextSize, valueTextSize, iconSize, descriptionTextSize;

    // Determine padding based on overall size
    if (widget.w === 1 && widget.h === 1) {
      headerPadding = 'px-3 py-2';
      contentPadding = 'px-3 py-1';
    } else if (widget.w === 1 || widget.h === 1) { // Either narrow (1 col) or short (1 row)
      headerPadding = 'px-4 py-3';
      contentPadding = 'px-4 py-2';
    } else { // Large widget (NxM, N>1, M>1)
      headerPadding = 'px-5 py-4';
      contentPadding = 'px-5 py-3';
    }

    // Determine text and icon sizes based on area
    const totalCells = widget.w * widget.h;
    if (totalCells <= 1) { // 1x1
      titleTextSize = 'text-xs';
      valueTextSize = 'text-lg';
      iconSize = 'w-3 h-3';
      descriptionTextSize = 'text-xs';
    } else if (totalCells <= 2) { // 1x2 or 2x1
      titleTextSize = 'text-sm';
      valueTextSize = 'text-2xl';
      iconSize = 'w-4 h-4';
      descriptionTextSize = 'text-xs';
    } else if (totalCells <= 4) { // 2x2, 1x3, 1x4, 3x1, 4x1
      titleTextSize = 'text-base';
      valueTextSize = 'text-3xl';
      iconSize = 'w-5 h-5';
      descriptionTextSize = 'text-sm';
    } else { // Larger widgets
      titleTextSize = 'text-lg';
      valueTextSize = 'text-5xl';
      iconSize = 'w-6 h-6';
      descriptionTextSize = 'text-base';
    }

    return {
      headerClasses: `pb-2 ${headerPadding}`,
      contentClasses: `flex-grow flex flex-col justify-center ${contentPadding}`,
      titleTextSize,
      valueTextSize,
      iconSize,
      descriptionTextSize
    };
  };

  const renderWidget = (widget) => {
    const commonProps = {
      draggable: isEditMode && !resizingItem,
      onDragStart: (e) => handleWidgetDragStart(e, widget),
      className: `relative ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`,
      style: {
        gridColumn: `span ${Math.min(widget.w, 6)}`, // Ensure max 6 columns
        gridRow: `span ${Math.min(widget.h, 4)}`, // Ensure max 4 rows
      }
    };

    const editControls = isEditMode && (
      <div
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full cursor-se-resize flex items-center justify-center border-2 border-gray-900 z-20 hover:bg-blue-400 transition-colors"
        onMouseDown={(e) => handleResizeStart(e, widget)}
      >
        <Move className="w-3 h-3 text-white" />
      </div>
    );

    // Calculate dynamic classes
    const widgetClasses = getWidgetClassNames(widget);

    switch (widget.type) {
      case 'servers':
        return (
          <div key={widget.id} {...commonProps}>
            <Card 
              className={`bg-gray-800 border-gray-700 h-full transition-all duration-300 flex flex-col ${
                isEditMode ? 'hover:ring-2 hover:ring-blue-500' : 'hover:bg-gray-700/50 hover:border-blue-500/50 cursor-pointer'
              }`}
              onClick={() => handleMetricClick('servers')}
            >
              <CardHeader className={`${widgetClasses.headerClasses}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`font-medium text-gray-400 ${widgetClasses.titleTextSize}`}>Servers</CardTitle>
                  <ServerIcon className={`text-blue-400 ${widgetClasses.iconSize}`} />
                </div>
              </CardHeader>
              <CardContent className={`${widgetClasses.contentClasses}`}>
                <div className={`font-bold text-gray-100 ${widgetClasses.valueTextSize}`}>
                  {systemStats.onlineServers}/{systemStats.totalServers}
                </div>
                {widget.h > 1 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor('online')}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                )}
                {!isEditMode && widget.h > 1 && widget.w > 1 && <p className={`text-blue-400 mt-2 ${widgetClasses.descriptionTextSize}`}>Click to view details →</p>}
              </CardContent>
            </Card>
            {editControls}
          </div>
        );

      case 'vms':
        return (
          <div key={widget.id} {...commonProps}>
            <Card 
              className={`bg-gray-800 border-gray-700 h-full transition-all duration-300 flex flex-col ${
                isEditMode ? 'hover:ring-2 hover:ring-purple-500' : 'hover:bg-gray-700/50 hover:border-purple-500/50 cursor-pointer'
              }`}
              onClick={() => handleMetricClick('vms')}
            >
              <CardHeader className={`${widgetClasses.headerClasses}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`font-medium text-gray-400 ${widgetClasses.titleTextSize}`}>
                    {widgetClasses.titleTextSize === 'text-xs' ? 'VMs' : 'Virtual Machines'}
                  </CardTitle>
                  <Activity className={`text-purple-400 ${widgetClasses.iconSize}`} />
                </div>
              </CardHeader>
              <CardContent className={`${widgetClasses.contentClasses}`}>
                <div className={`font-bold text-gray-100 ${widgetClasses.valueTextSize}`}>{systemStats.totalVMs}</div>
                {widget.h > 1 && <p className={`${widgetClasses.descriptionTextSize} text-gray-500 mt-1`}>Running across ESXi hosts</p>}
                {!isEditMode && widget.h > 1 && widget.w > 1 && <p className={`text-purple-400 mt-2 ${widgetClasses.descriptionTextSize}`}>Click to view overview →</p>}
              </CardContent>
            </Card>
            {editControls}
          </div>
        );

      case 'containers':
        return (
          <div key={widget.id} {...commonProps}>
            <Card 
              className={`bg-gray-800 border-gray-700 h-full transition-all duration-300 flex flex-col ${
                isEditMode ? 'hover:ring-2 hover:ring-emerald-500' : 'hover:bg-gray-700/50 hover:border-emerald-500/50 cursor-pointer'
              }`}
              onClick={() => handleMetricClick('containers')}
            >
              <CardHeader className={`${widgetClasses.headerClasses}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`font-medium text-gray-400 ${widgetClasses.titleTextSize}`}>
                    {widgetClasses.titleTextSize === 'text-xs' ? 'Containers' : 'Containers'}
                  </CardTitle>
                  <Container className={`text-emerald-400 ${widgetClasses.iconSize}`} />
                </div>
              </CardHeader>
              <CardContent className={`${widgetClasses.contentClasses}`}>
                <div className={`font-bold text-gray-100 ${widgetClasses.valueTextSize}`}>{systemStats.totalContainers}</div>
                {widget.h > 1 && <p className={`${widgetClasses.descriptionTextSize} text-gray-500 mt-1`}>Docker containers active</p>}
                {!isEditMode && widget.h > 1 && widget.w > 1 && <p className={`text-emerald-400 mt-2 ${widgetClasses.descriptionTextSize}`}>Click to view overview →</p>}
              </CardContent>
            </Card>
            {editControls}
          </div>
        );

      case 'storage':
        return (
          <div key={widget.id} {...commonProps}>
            <Card 
              className={`bg-gray-800 border-gray-700 h-full transition-all duration-300 flex flex-col ${
                isEditMode ? 'hover:ring-2 hover:ring-orange-500' : 'hover:bg-gray-700/50 hover:border-orange-500/50 cursor-pointer'
              }`}
              onClick={() => handleMetricClick('storage')}
            >
              <CardHeader className={`${widgetClasses.headerClasses}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`font-medium text-gray-400 ${widgetClasses.titleTextSize}`}>Storage</CardTitle>
                  <HardDrive className={`text-orange-400 ${widgetClasses.iconSize}`} />
                </div>
              </CardHeader>
              <CardContent className={`${widgetClasses.contentClasses}`}>
                <div className={`font-bold text-gray-100 ${widgetClasses.valueTextSize}`}>{systemStats.storageUsed}GB</div>
                {widget.h > 1 && (
                  <>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-orange-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(systemStats.storageUsed / systemStats.totalStorage) * 100}%` }}
                      ></div>
                    </div>
                    <p className={`${widgetClasses.descriptionTextSize} text-gray-500 mt-1`}>of {systemStats.totalStorage}GB total</p>
                  </>
                )}
                {!isEditMode && widget.h > 1 && widget.w > 1 && <p className={`text-orange-400 mt-2 ${widgetClasses.descriptionTextSize}`}>Click to view overview →</p>}
              </CardContent>
            </Card>
            {editControls}
          </div>
        );

      case 'system-overview':
        return (
          <div key={widget.id} {...commonProps}>
            <div className={`h-full ${isEditMode ? 'hover:ring-2 hover:ring-blue-500 rounded-lg' : ''}`}>
              <SystemOverview widget={widget} onClick={!isEditMode ? () => setIsSystemOverviewModalOpen(true) : undefined} />
            </div>
            {editControls}
          </div>
        );

      case 'server-status':
        return (
          <div key={widget.id} {...commonProps}>
            <div className={`h-full ${isEditMode ? 'hover:ring-2 hover:ring-green-500 rounded-lg' : ''}`}>
              <ServerStatusGrid widget={widget} servers={servers} onHostClick={!isEditMode ? handleHostClick : undefined} />
            </div>
            {editControls}
          </div>
        );

      case 'resource-monitor':
        return (
          <div key={widget.id} {...commonProps}>
            <div className={`h-full ${isEditMode ? 'hover:ring-2 hover:ring-purple-500 rounded-lg' : 'cursor-pointer'}`} onClick={!isEditMode ? () => setIsSystemOverviewModalOpen(true) : undefined}>
              <ResourceMonitor widget={widget} />
            </div>
            {editControls}
          </div>
        );

      case 'recent-alerts':
        return (
          <div key={widget.id} {...commonProps}>
            <div className={`h-full ${isEditMode ? 'hover:ring-2 hover:ring-yellow-500 rounded-lg' : ''}`}>
              <RecentAlerts widget={widget} />
            </div>
            {editControls}
          </div>
        );

      default:
        return null;
    }
  };

  const renderGrid = () => {
    const gridCols = 6; // Increased for more granular control
    const gridRows = Math.max(
      ...dashboardWidgets.map(w => w.y + w.h),
      8 // Increased for more vertical space
    );

    const gridItems = new Map();
    const occupiedPositions = new Set();

    dashboardWidgets.forEach(widget => {
      const { x, y, w, h } = widget;
      gridItems.set(`${x},${y}`, widget);
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
        const widgetAtCoord = gridItems.get(currentCoord);

        if (widgetAtCoord) {
          renderedGridCells.push(renderWidget(widgetAtCoord));
          col += (widgetAtCoord.w || 1) - 1;
        } else if (!occupiedPositions.has(currentCoord)) {
          renderedGridCells.push(
            <div
              key={`empty-${col}-${row}`}
              className={`border-2 border-dashed border-transparent transition-colors ${
                isEditMode ? 'hover:border-blue-500/50 hover:bg-blue-500/5' : ''
              }`}
              onDrop={(e) => handleGridCellDrop(e, col, row)}
              onDragOver={handleGridCellDragOver}
              style={{ minHeight: '150px' }}
            />
          );
        }
      }
    }
    return renderedGridCells;
  };

  return (
    <>
      <SystemOverviewTimelineModal 
        isOpen={isSystemOverviewModalOpen}
        onClose={() => setIsSystemOverviewModalOpen(false)}
      />
      <DashboardMetricModal
        isOpen={isDashboardMetricModalOpen}
        onClose={() => setIsDashboardMetricModalOpen(false)}
        metricType={selectedMetric}
      />
      <DashboardServerModal
        isOpen={isDashboardServerModalOpen}
        onClose={() => setIsDashboardServerModalOpen(false)}
      />
      <HostControlPanelModal
        isOpen={isHostControlPanelOpen}
        onClose={() => setIsHostControlPanelOpen(false)}
        host={selectedHost}
      />
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Infrastructure Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your homelab environment</p>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-gray-800 border-gray-700">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-gray-100">Dashboard Settings</h4>
                    <p className="text-sm text-gray-400">Customize your dashboard layout.</p>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="edit-mode" className="text-gray-300 text-sm">Customize Layout</Label>
                    <Switch id="edit-mode" checked={isEditMode} onCheckedChange={setIsEditMode} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Live</span>
              </div>
            </div>
          </div>
        </div>

        {isEditMode && (
          <div className="text-sm text-gray-400 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
            <strong className="text-blue-400">God Mode Activated:</strong> Drag widgets to reposition them. Resize widgets by dragging the bottom-right corner. Make them as big or small as you want!
            {pendingUpdates.size > 0 && (
              <span className="ml-2 text-yellow-400">
                • {pendingUpdates.size} pending change{pendingUpdates.size !== 1 ? 's' : ''} (saving automatically...)
              </span>
            )}
          </div>
        )}

        <div
          ref={gridRef}
          className="grid grid-cols-6 gap-4"
          style={{ gridAutoRows: 'minmax(150px, auto)' }}
        >
          {renderGrid()}
        </div>
      </div>
    </>
  );
}
