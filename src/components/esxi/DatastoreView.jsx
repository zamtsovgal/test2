import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Database, Archive, Zap } from "lucide-react";
import { motion } from "framer-motion";

const mockDatastores = [
  {
    id: "ds1",
    name: "datastore1-ssd",
    type: "VMFS",
    capacity: 500,
    used: 320,
    free: 180,
    vms: 8,
    status: "healthy",
    tier: "ssd"
  },
  {
    id: "ds2",
    name: "datastore2-hdd",
    type: "VMFS", 
    capacity: 2000,
    used: 1200,
    free: 800,
    vms: 12,
    status: "healthy",
    tier: "hdd"
  },
  {
    id: "ds3",
    name: "datastore3-nvme",
    type: "VMFS",
    capacity: 1000,
    used: 450,
    free: 550,
    vms: 6,
    status: "warning",
    tier: "nvme"
  },
  {
    id: "ds4",
    name: "iso-repository",
    type: "NFS",
    capacity: 100,
    used: 75,
    free: 25,
    vms: 0,
    status: "healthy",
    tier: "archive"
  }
];

export default function DatastoreView({ hostId }) {
  const getStatusColor = (status) => {
    const colors = {
      healthy: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30",
      warning: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      critical: "text-red-400 bg-red-400/20 border-red-400/30",
      offline: "text-gray-400 bg-gray-400/20 border-gray-400/30"
    };
    return colors[status] || colors.offline;
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'nvme': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'ssd': return <Database className="w-4 h-4 text-blue-400" />;
      case 'hdd': return <HardDrive className="w-4 h-4 text-emerald-400" />;
      case 'archive': return <Archive className="w-4 h-4 text-orange-400" />;
      default: return <HardDrive className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      nvme: "text-purple-400 bg-purple-400/20",
      ssd: "text-blue-400 bg-blue-400/20",
      hdd: "text-emerald-400 bg-emerald-400/20",
      archive: "text-orange-400 bg-orange-400/20"
    };
    return colors[tier] || "text-gray-400 bg-gray-400/20";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">3.6TB</div>
            <p className="text-xs text-gray-500">Across all datastores</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Used Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">2.0TB</div>
            <p className="text-xs text-gray-500">56% utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Free Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">1.6TB</div>
            <p className="text-xs text-gray-500">Available for allocation</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active VMs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">26</div>
            <p className="text-xs text-gray-500">Virtual machines stored</p>
          </CardContent>
        </Card>
      </div>

      {/* Datastore List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Datastores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDatastores.map((datastore, index) => (
              <motion.div
                key={datastore.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTierIcon(datastore.tier)}
                    <div>
                      <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                        {datastore.name}
                        <Badge className={`${getStatusColor(datastore.status)} border text-xs`}>
                          {datastore.status}
                        </Badge>
                        <Badge className={`${getTierColor(datastore.tier)} text-xs uppercase`}>
                          {datastore.tier}
                        </Badge>
                      </h3>
                      <p className="text-sm text-gray-400">
                        {datastore.type} • {datastore.vms} VMs
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-100">
                      {datastore.used}GB / {datastore.capacity}GB
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round((datastore.used / datastore.capacity) * 100)}% used
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Storage Usage</span>
                    <span className="text-gray-300">{datastore.free}GB free</span>
                  </div>
                  <Progress 
                    value={(datastore.used / datastore.capacity) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="text-center p-2 bg-gray-600/30 rounded">
                    <div className="text-gray-400">Type</div>
                    <div className="font-semibold text-gray-100">{datastore.type}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-600/30 rounded">
                    <div className="text-gray-400">VMs</div>
                    <div className="font-semibold text-blue-400">{datastore.vms}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-600/30 rounded">
                    <div className="text-gray-400">Status</div>
                    <div className={`font-semibold capitalize ${
                      datastore.status === 'healthy' ? 'text-emerald-400' :
                      datastore.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {datastore.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}