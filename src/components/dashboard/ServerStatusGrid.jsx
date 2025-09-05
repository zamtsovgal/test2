
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Activity, AlertTriangle, CheckCircle, XCircle, Cpu, MemoryStick, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ServerStatusGrid({ servers, onHostClick, widget }) {
  // Responsive sizing based on widget dimensions
  const getResponsiveClasses = () => {
    const w = widget?.w || 2;
    const h = widget?.h || 2;
    const totalCells = w * h;

    // 1. Determine number of internal columns based on widget width
    let gridCols = 'grid-cols-1';
    let numCols = 1;
    if (w >= 5) {
        gridCols = 'grid-cols-3';
        numCols = 3;
    } else if (w >= 2) {
        gridCols = 'grid-cols-2';
        numCols = 2;
    }

    // 2. Be VERY conservative about showing text - only show on really wide widgets
    const showStatusText = w >= 4 && numCols <= 2; // Only show text on 4+ width widgets with max 2 columns

    // 3. Make everything scale properly
    let titleSize, headerPadding, contentPadding, iconSize, badgeSize, nameSize, ipSize, cardPadding, metricPadding, metricTextSize, emojiSize, showIP, metricIconSize, metricCols;

    if (totalCells <= 1) { // 1x1 - ultra compact
        titleSize = 'text-xs'; headerPadding = 'px-2 py-1'; contentPadding = 'px-2 py-1';
        iconSize = 'w-3 h-3'; badgeSize = 'text-xs px-1 py-0'; nameSize = 'text-xs';
        ipSize = 'text-xs'; cardPadding = 'p-1'; metricPadding = 'p-0.5'; metricTextSize = 'text-xs';
        emojiSize = 'text-xs'; showIP = false; metricIconSize = 'w-2 h-2'; metricCols = 'grid-cols-3';
    } else if (totalCells <= 2) { // 1x2, 2x1 - compact
        titleSize = 'text-sm'; headerPadding = 'px-3 py-2'; contentPadding = 'px-3 py-2';
        iconSize = 'w-3 h-3'; badgeSize = 'text-xs px-1 py-0'; nameSize = 'text-sm';
        ipSize = 'text-xs'; cardPadding = 'p-2'; metricPadding = 'p-1'; metricTextSize = 'text-xs';
        emojiSize = 'text-sm'; showIP = h > 1; metricIconSize = 'w-3 h-3'; metricCols = 'grid-cols-3';
    } else if (totalCells <= 4) { // 2x2 - medium
        titleSize = 'text-base'; headerPadding = 'px-4 py-3'; contentPadding = 'px-4 py-3';
        iconSize = 'w-3 h-3'; badgeSize = 'text-xs px-2 py-1'; nameSize = 'text-sm';
        ipSize = 'text-xs'; cardPadding = 'p-3'; metricPadding = 'p-1.5'; metricTextSize = 'text-xs';
        emojiSize = 'text-base'; showIP = true; metricIconSize = 'w-3 h-3'; metricCols = 'grid-cols-3';
    } else { // Large widgets
        titleSize = 'text-lg'; headerPadding = 'px-5 py-4'; contentPadding = 'px-5 py-4';
        iconSize = 'w-4 h-4'; badgeSize = 'text-sm px-2 py-1'; nameSize = 'text-base';
        ipSize = 'text-sm'; cardPadding = 'p-4'; metricPadding = 'p-2'; metricTextSize = 'text-sm';
        emojiSize = 'text-lg'; showIP = true; metricIconSize = 'w-4 h-4'; metricCols = 'grid-cols-3';
    }

    return {
        titleSize, headerPadding, contentPadding, iconSize, badgeSize, nameSize, ipSize,
        gridCols, gap: 'gap-3', cardPadding, metricPadding, metricTextSize, emojiSize,
        showIP, showStatusText, metricIconSize, metricCols
    };
  };

  const getStatusIcon = (status) => {
    const classes = getResponsiveClasses();
    switch (status) {
      case 'online': return <CheckCircle className={`${classes.iconSize} text-emerald-400`} />;
      case 'warning': return <AlertTriangle className={`${classes.iconSize} text-yellow-400`} />;
      case 'error': return <XCircle className={`${classes.iconSize} text-red-400`} />;
      default: return <XCircle className={`${classes.iconSize} text-gray-400`} />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      online: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      offline: "text-gray-400 bg-gray-400/20 border-gray-400/30",
      warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      error: "text-red-400 bg-red-400/20 border-red-400/30"
    };
    return colors[status] || colors.offline;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'esxi':
      case 'vcenter': return '🖥️';
      case 'nas': return '💾';
      case 'docker': return '🐳';
      default: return '🖥️';
    }
  };

  // Mock data if no servers exist
  const displayServers = servers.length > 0 ? servers : [
    { id: '1', name: 'ESXi-HOST-01', type: 'esxi', host: '192.168.1.100', status: 'online' },
    { id: '2', name: 'vCenter-SERVER', type: 'vcenter', host: '192.168.1.101', status: 'online' },
    { id: '3', name: 'NAS-STORAGE', type: 'nas', host: '192.168.1.102', status: 'warning' },
    { id: '4', name: 'DOCKER-HOST', type: 'docker', host: '192.168.1.103', status: 'online' },
  ];
  
  const classes = getResponsiveClasses();

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader className={classes.headerPadding}>
        <CardTitle className={`text-gray-100 flex items-center gap-2 ${classes.titleSize}`}>
          <Server className={classes.iconSize} />
          Server Status
          {widget?.w > 2 && <span className="text-xs text-gray-400 font-normal ml-auto hidden lg:inline">Click servers for control panel</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className={`flex-grow ${classes.contentPadding}`}>
        <div className={`grid ${classes.gridCols} ${classes.gap} h-full overflow-y-auto`}>
          {displayServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${classes.cardPadding} bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700 cursor-pointer transition-all duration-300`}
              onClick={() => onHostClick && onHostClick(server)}
            >
              <div className={`flex items-center justify-between mb-2`}>
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <span className={classes.emojiSize}>{getTypeIcon(server.type)}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-gray-100 ${classes.nameSize} truncate`}>{server.name}</h3>
                    {classes.showIP && <p className={`text-gray-400 ${classes.ipSize} truncate`}>{server.host}</p>}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Badge className={`${getStatusColor(server.status)} border ${classes.badgeSize} flex items-center gap-1 max-w-fit`}>
                    {getStatusIcon(server.status)}
                    {classes.showStatusText && <span className="whitespace-nowrap">{server.status}</span>}
                  </Badge>
                </div>
              </div>
              
              <div className={`grid ${classes.metricCols} gap-1 ${classes.metricTextSize}`}>
                <div className={`flex flex-col items-center justify-center ${classes.metricPadding} bg-gray-600/30 rounded`}>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Cpu className={classes.metricIconSize} />
                    CPU
                  </div>
                  <div className="font-semibold text-blue-400">{Math.floor(Math.random() * 40) + 30}%</div>
                </div>
                <div className={`flex flex-col items-center justify-center ${classes.metricPadding} bg-gray-600/30 rounded`}>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MemoryStick className={classes.metricIconSize} />
                    Memory
                  </div>
                  <div className="font-semibold text-emerald-400">{Math.floor(Math.random() * 30) + 50}%</div>
                </div>
                <div className={`flex flex-col items-center justify-center ${classes.metricPadding} bg-gray-600/30 rounded`}>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className={classes.metricIconSize} />
                    Uptime
                  </div>
                  <div className="font-semibold text-purple-400">{Math.floor(Math.random() * 30) + 1}d</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
