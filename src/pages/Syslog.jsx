
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const mockLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    level: "error",
    source: "ESXi-HOST-01",
    message: "VM 'web-server-01' failed to start due to insufficient memory",
    details: "vSphere API returned error: Cannot complete the operation because of insufficient memory resources",
    category: "virtualization"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    level: "warning",
    source: "pfsense-fw",
    message: "Blocked suspicious inbound traffic from 123.45.67.89",
    details: "Rule: 'Block Bogon Networks', Protocol: TCP, Port: 445",
    category: "firewall"
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    level: "info",
    source: "Docker-Host-01",
    message: "Container 'nginx-proxy' started successfully",
    details: "Container ID: 7f4e6d3a8b2c, Image: nginx:latest, Status: running",
    category: "docker"
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    level: "info",
    source: "Mail-Server",
    message: "Email from user@example.com to test@example.com delivered",
    details: "Message-ID: <abc-123@example.com>",
    category: "mail"
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    level: "warning",
    source: "UniFi-Switch-01",
    message: "Port 24 flapping, link down/up 5 times in 1 minute",
    details: "Device connected: 'Living Room TV'",
    category: "switch"
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    level: "info",
    source: "vCenter",
    message: "User 'admin' logged in from 192.168.1.5",
    details: "Successful login event",
    category: "vcenter"
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    level: "error",
    source: "VM-web-02",
    message: "Service 'apache2' failed to start",
    details: "systemctl status apache2 returned exit code 1",
    category: "vm"
  }
];

const categories = [
    "all", "firewall", "vcenter", "esxihost", "docker", "docker host",
    "vm", "servers", "switch", "mail", "virtualization"
];

export default function SyslogPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filterLogs = useCallback(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);
  
  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      error: "text-red-400 bg-red-400/20 border-red-400/30",
      warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      success: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      info: "text-blue-400 bg-blue-400/20 border-blue-400/30",
    };
    return colors[level] || colors.info;
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      firewall: "bg-orange-500/20 text-orange-400",
      vcenter: "bg-blue-500/20 text-blue-400",
      esxihost: "bg-indigo-500/20 text-indigo-400",
      docker: "bg-cyan-500/20 text-cyan-400",
      "docker host": "bg-sky-500/20 text-sky-400",
      vm: "bg-purple-500/20 text-purple-400",
      servers: "bg-gray-500/20 text-gray-400",
      switch: "bg-lime-500/20 text-lime-400",
      mail: "bg-rose-500/20 text-rose-400",
      virtualization: "bg-emerald-500/20 text-emerald-400",
    };
    return categoryColors[category] || "bg-gray-500/20 text-gray-400";
  };

  const refreshLogs = () => {
    setLogs([...mockLogs].sort(() => Math.random() - 0.5)); // shuffle to simulate new logs
    toast.success("Logs have been refreshed.");
  };

  const exportLogs = () => {
      toast.info("Exporting logs...");
      // In a real app, this would trigger a download
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Syslog Viewer</h1>
          <p className="text-gray-400">Monitor and analyze system events across your infrastructure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={refreshLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Log Entries
            <Badge className="bg-gray-700 text-gray-300 ml-2">
              {filteredLogs.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getLevelIcon(log.level)}
                    <div>
                      <h3 className="font-semibold text-gray-100 flex items-center gap-2 flex-wrap">
                        {log.message}
                        <Badge className={`${getLevelColor(log.level)} border text-xs`}>
                          {log.level}
                        </Badge>
                        <Badge className={getCategoryColor(log.category)}>
                          {log.category}
                        </Badge>
                      </h3>
                      <p className="text-sm text-gray-400">{log.source}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0 ml-4">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(log.timestamp)} ago
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">{log.details}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-500">
                  {log.timestamp.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No logs match the current filters</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
