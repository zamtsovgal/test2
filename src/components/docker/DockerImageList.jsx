import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Container, 
  HardDrive,
  Upload,
  Play
} from "lucide-react";

const mockImages = [
  { name: "nginx", tag: "latest", size: "142MB", created: "2 days ago" },
  { name: "postgres", tag: "13", size: "374MB", created: "5 days ago" },
  { name: "redis", tag: "alpine", size: "32MB", created: "1 week ago" },
  { name: "grafana/grafana", tag: "latest", size: "256MB", created: "3 days ago" },
  { name: "portainer/portainer-ce", tag: "latest", size: "79MB", created: "1 week ago" }
];

export default function DockerImageList({ onRun }) {
    
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Docker Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Container className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-100">{image.name}:{image.tag}</h3>
                        <p className="text-sm text-gray-400">Created {image.created}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-100">{image.size}</div>
                        <div className="text-xs text-gray-400">Size</div>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onRun(image)}>
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
    )
}