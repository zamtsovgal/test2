import React from 'react';
import Modal from '../shared/Modal';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertTriangle, Info, XCircle, CheckCircle, Clock, Server, FileText, BarChart2 } from "lucide-react";

export default function AlertDetailsModal({ isOpen, onClose, alert }) {
    if (!alert) return null;

    const getAlertIcon = (type, className = "w-6 h-6") => {
        switch (type) {
            case 'warning': return <AlertTriangle className={`${className} text-yellow-400`} />;
            case 'error': return <XCircle className={`${className} text-red-400`} />;
            case 'success': return <CheckCircle className={`${className} text-emerald-400`} />;
            case 'info': return <Info className={`${className} text-blue-400`} />;
            default: return <Info className={`${className} text-gray-400`} />;
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

    const mockTimeline = [
        { status: "Event Triggered", time: alert.timestamp },
        { status: "Notification Sent", time: new Date(alert.timestamp.getTime() + 2000) },
        { status: "Acknowledged", time: new Date(alert.timestamp.getTime() + 60000) },
        { status: "Monitoring", time: new Date(alert.timestamp.getTime() + 120000) },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Alert Details"
            size="lg"
        >
            <div className="space-y-6 p-1">
                <div className="flex items-start gap-4">
                    {getAlertIcon(alert.type, "w-10 h-10 mt-1")}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-100">{alert.title}</h3>
                        <p className="text-gray-400">{alert.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Server className="w-4 h-4" />
                            <span>Source Server</span>
                        </div>
                        <p className="font-semibold text-gray-200">{alert.server}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>Timestamp</span>
                        </div>
                        <p className="font-semibold text-gray-200">{format(alert.timestamp, "MMM d, yyyy 'at' hh:mm:ss a")}</p>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                           <Info className="w-4 h-4" />
                            <span>Status</span>
                        </div>
                         <Badge variant="outline" className={`${getAlertColor(alert.type)} border text-sm`}>
                            {alert.type}
                        </Badge>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-3">Event Timeline</h4>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-700" style={{ left: '12px' }}></div>
                        {mockTimeline.map((item, index) => (
                             <div key={index} className="relative mb-6">
                                <div className={`absolute -left-1.5 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                    <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                                </div>
                                <div className="ml-8">
                                    <p className="font-semibold text-gray-200">{item.status}</p>
                                    <p className="text-xs text-gray-400">{format(item.time, "hh:mm:ss a")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                     <button className="w-full text-center py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Full Log
                    </button>
                    <button className="w-full text-center py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        Analyze Metrics
                    </button>
                </div>
            </div>
        </Modal>
    );
}