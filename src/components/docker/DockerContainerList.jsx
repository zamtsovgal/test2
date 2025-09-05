import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Container, 
  Play, 
  Pause, 
  Square, 
  RotateCw,
  Trash2,
  Cpu,
  MemoryStick,
  Settings
} from "lucide-react";

export default function DockerContainerList({ containers, getStatusColor, getStatusIcon, onAction, onRemove, onSelect }) {
    const handleActionClick = (e, action, containerId) => {
        e.stopPropagation();
        onAction(containerId, action);
    };

    const handleRemoveClick = (e, containerId) => {
        e.stopPropagation();
        onRemove(containerId);
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <Container className="w-5 h-5" />
                Containers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {containers.map((container, index) => (
                  <motion.div
                    key={container.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-blue-500 transition-all duration-300 cursor-pointer"
                    onClick={() => onSelect(container)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Container className="w-6 h-6 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                            {container.name}
                            <Badge className={`${getStatusColor(container.status)} border text-xs`}>
                              {getStatusIcon(container.status)}
                              <span className="ml-1 capitalize">{container.status}</span>
                            </Badge>
                          </h3>
                          <p className="text-sm text-gray-400">{container.image}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {container.status === 'running' && (
                          <>
                            <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={(e) => handleActionClick(e, 'restart', container.id)}>
                              <RotateCw className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={(e) => handleActionClick(e, 'stop', container.id)}>
                              <Square className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {container.status === 'stopped' && (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={(e) => handleActionClick(e, 'start', container.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="destructive-outline" className="text-red-400 border-red-400/50 hover:bg-red-400/10" onClick={(e) => handleRemoveClick(e, container.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-gray-400">CPU</div>
                          <div className="font-semibold text-gray-100">{container.cpu}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                        <MemoryStick className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-gray-400">Memory</div>
                          <div className="font-semibold text-gray-100">{container.memory}MB</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                        <div className="w-4 h-4 text-orange-400">🌐</div>
                        <div>
                          <div className="text-gray-400">Ports</div>
                          <div className="font-semibold text-gray-100 text-xs">{container.ports}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-gray-600/30 rounded">
                        <div className="w-4 h-4 text-pink-400">🔗</div>
                        <div>
                          <div className="text-gray-400">Network</div>
                          <div className="font-semibold text-gray-100 text-xs">{container.network}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
    )
}