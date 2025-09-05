import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, description, children, footer, size = "default" }) {
  const sizeClasses = {
    sm: "sm:max-w-[400px]",
    default: "sm:max-w-[500px]",
    lg: "sm:max-w-[700px]",
    xl: "sm:max-w-[900px]",
    full: "sm:max-w-[95vw]"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} bg-gray-800/95 backdrop-blur-xl border border-gray-700/80 text-gray-100 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden`}>
        {/* Enhanced Header with Gradient */}
        <DialogHeader className="relative border-b border-gray-700/50 pb-4 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-gray-400 text-base leading-relaxed">
                  {description}
                </DialogDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 text-gray-400 hover:text-gray-100"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Enhanced Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {children}
        </motion.div>

        {/* Enhanced Footer */}
        {footer && (
          <DialogFooter className="border-t border-gray-700/50 pt-6 mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex gap-3 justify-end w-full"
            >
              {footer}
            </motion.div>
          </DialogFooter>
        )}

        {/* Subtle Animation Border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}