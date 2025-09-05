
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AlertDetailsModal from "./AlertDetailsModal";

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High Memory Usage",
    message: "ESXi-HOST-01 memory usage is currently at 85% which is above the configured threshold of 80%. Consider migrating VMs or allocating more resources.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    server: "ESXi-HOST-01"
  },
  {
    id: 2,
    type: "info",
    title: "Backup Completed",
    message: "Nightly backup job 'nas-full-backup' completed successfully. Processed 1.2TB of data in 45 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    server: "NAS-STORAGE"
  },
  {
    id: 3,
    type: "error",
    title: "Container Failed",
    message: "Docker container 'web-app' has entered a failed state after 3 restart attempts. Please check container logs for details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    server: "DOCKER-HOST"
  },
  {
    id: 4,
    type: "success",
    title: "VM Started",
    message: "Virtual machine 'db-server' on vCenter was started successfully after scheduled maintenance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    server: "vCenter-SERVER"
  }
];

export default function RecentAlerts({ widget }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-3 h-3 lg:w-4 lg:h-4 text-red-400" />;
      case 'success': return <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-400" />;
      case 'info': return <Info className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />;
      default: return <Info className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />;
    }
  };

  const getAlertColor = (type) => {
    const colors = {
      warning: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
      error: "bg-red-400/20 text-red-400 border-red-400/30",
      success: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30",
      info: "bg-blue-400/20 text-blue-400 border-blue-400/30",
    };
    return colors[type] || colors.info;
  };

  return (
    <>
      <AlertDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={selectedAlert}
      />
      <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-100 flex items-center gap-2 text-base lg:text-lg">
            <Clock className="w-5 h-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3 lg:space-y-4 h-full overflow-y-auto">
            {mockAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="p-2 lg:p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 hover:border-blue-500/50 cursor-pointer transition-all duration-200"
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <h4 className="font-medium text-gray-100 text-xs lg:text-sm">{alert.title}</h4>
                  </div>
                  <Badge variant="outline" className={`${getAlertColor(alert.type)} border text-xs`}>
                    {alert.type}
                  </Badge>
                </div>
                <p className={`text-xs text-gray-400 mb-2 ${widget?.w > 1 ? 'line-clamp-3' : 'line-clamp-2'}`}>{alert.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate">{alert.server}</span>
                  <span className="ml-2 flex-shrink-0">{formatDistanceToNow(alert.timestamp)} ago</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
