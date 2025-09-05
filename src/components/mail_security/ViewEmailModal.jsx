import React from 'react';
import Modal from '../shared/Modal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Unlock, Trash2 } from 'lucide-react';

export default function ViewEmailModal({ isOpen, onClose, email, onRelease, onDelete }) {
  if (!email) return null;

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Close</Button>
      {email.status === 'quarantined' && (
        <>
          <Button variant="destructive" onClick={() => onDelete(email.id)}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button onClick={() => onRelease(email.id)}>
            <Unlock className="w-4 h-4 mr-2" /> Release
          </Button>
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quarantined Email Details"
      description="Review the details of the blocked email."
      footer={footer}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong className="text-gray-400">From:</strong> <span className="text-gray-200">{email.from}</span></div>
          <div><strong className="text-gray-400">To:</strong> <span className="text-gray-200">{email.to}</span></div>
          <div><strong className="text-gray-400">Timestamp:</strong> <span className="text-gray-200">{email.timestamp}</span></div>
        </div>
        <div>
          <strong className="text-gray-400 text-sm">Subject:</strong>
          <p className="text-gray-200 text-base mt-1">{email.subject}</p>
        </div>
        <div className="flex gap-4">
          <div>
            <strong className="text-gray-400 text-sm">Threat Type:</strong>
            <Badge className="ml-2 bg-red-500/20 text-red-400">{email.threat}</Badge>
          </div>
          <div>
            <strong className="text-gray-400 text-sm">Severity:</strong>
            <Badge className="ml-2 bg-orange-500/20 text-orange-400 capitalize">{email.severity}</Badge>
          </div>
        </div>
        <div>
          <strong className="text-gray-400 text-sm">Email Body (Preview):</strong>
          <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700 h-48 overflow-y-auto text-gray-300">
            <p>This is a simulated preview of the email body content.</p>
            <p className="mt-4">It would contain potentially malicious links or attachments.</p>
            <p className="mt-2">For example: Please click here to reset your password: <a href="#" className="text-blue-400 underline">http://totally-legit-link.com/reset</a></p>
          </div>
        </div>
      </div>
    </Modal>
  );
}