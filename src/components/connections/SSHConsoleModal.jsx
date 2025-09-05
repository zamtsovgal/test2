
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Terminal, Maximize2, Minimize2, Copy, Download, Settings, X } from 'lucide-react';
import { toast } from "sonner";

export default function SSHConsoleModal({ isOpen, onClose, connection }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && connection) {
            // Simulate connection
            setHistory([
                { type: 'system', content: `Connecting to ${connection.name} (${connection.host})...` },
                { type: 'system', content: `Connected successfully as ${connection.username}` },
                { type: 'system', content: `Last login: ${new Date().toLocaleString()}` },
                { type: 'prompt', content: `${connection.username}@${connection.host.split('.').pop()}:~$ ` }
            ]);
            setIsConnected(true);
        } else {
            setHistory([]);
            setIsConnected(false);
            setCommandHistory([]);
            setHistoryIndex(-1);
        }
    }, [isOpen, connection]);

    const handleCommand = (e) => {
        if (e.key === 'Enter' && command.trim()) {
            const newHistory = [...history];
            newHistory.push({ 
                type: 'input', 
                content: `${connection?.username}@${connection?.host.split('.').pop()}:~$ ${command}` 
            });
            
            // Add to command history
            setCommandHistory(prev => [...prev, command]);
            setHistoryIndex(-1);
            
            // Simulate command responses
            switch (command.toLowerCase().trim()) {
                case 'ls':
                case 'ls -la':
                    newHistory.push({ 
                        type: 'output', 
                        content: 'total 48\ndrwxr-xr-x 2 user user 4096 Jan 15 10:30 .\ndrwxr-xr-x 3 root root 4096 Jan 10 08:15 ..\n-rw-r--r-- 1 user user  220 Jan 10 08:15 .bash_logout\n-rw-r--r-- 1 user user 3771 Jan 10 08:15 .bashrc\ndrwxrwxr-x 2 user user 4096 Jan 15 10:25 Documents\ndrwxrwxr-x 2 user user 4096 Jan 15 10:25 Downloads' 
                    });
                    break;
                case 'ps aux':
                    newHistory.push({ 
                        type: 'output', 
                        content: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1  19472  1532 ?        Ss   Jan01   0:01 /sbin/init\nroot       123  0.0  0.2  12345  2048 ?        S    10:30   0:00 systemd\nnginx     1234  0.0  0.2  12345  2048 ?        S    10:30   0:00 nginx: worker process\nuser      5678  0.1  0.5  45678  8192 pts/0    S+   14:30   0:01 bash' 
                    });
                    break;
                case 'df -h':
                    newHistory.push({ 
                        type: 'output', 
                        content: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        20G  8.5G   11G  45% /\n/dev/sda2       100G   45G   50G  48% /home\ntmpfs           2.0G     0  2.0G   0% /dev/shm\n/dev/sdb1       500G  120G  380G  24% /var/lib/docker' 
                    });
                    break;
                case 'free -h':
                    newHistory.push({ 
                        type: 'output', 
                        content: '              total        used        free      shared  buff/cache   available\nMem:           7.8G        2.1G        3.2G        124M        2.5G        5.4G\nSwap:          2.0G          0B        2.0G' 
                    });
                    break;
                case 'top':
                    newHistory.push({ 
                        type: 'output', 
                        content: 'top - 14:30:15 up 5 days,  2:15,  2 users,  load average: 0.15, 0.10, 0.05\nTasks: 125 total,   1 running, 124 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  2.5 us,  1.2 sy,  0.0 ni, 96.0 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   7982.2 total,   3201.4 free,   2156.8 used,   2624.0 buff/cache\nMiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5489.6 avail Mem\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1234 nginx     20   0   12345   2048   1024 S   1.5   0.0   0:00.15 nginx\n 5678 user      20   0   45678   8192   4096 S   0.5   0.1   0:01.23 bash' 
                    });
                    break;
                case 'uptime':
                    newHistory.push({ 
                        type: 'output', 
                        content: '14:30:15 up 5 days,  2:15,  2 users,  load average: 0.15, 0.10, 0.05' 
                    });
                    break;
                case 'whoami':
                    newHistory.push({ 
                        type: 'output', 
                        content: connection?.username || 'user' 
                    });
                    break;
                case 'pwd':
                    newHistory.push({ 
                        type: 'output', 
                        content: `/home/${connection?.username || 'user'}` 
                    });
                    break;
                case 'clear':
                    setHistory([{ type: 'prompt', content: `${connection?.username}@${connection?.host.split('.').pop()}:~$ ` }]);
                    setCommand('');
                    return;
                case 'exit':
                    toast.info('SSH session terminated');
                    onClose();
                    return;
                case 'help':
                    newHistory.push({ 
                        type: 'output', 
                        content: 'Available commands:\n  ls, ls -la    - List directory contents\n  ps aux        - Show running processes\n  df -h         - Show disk usage\n  free -h       - Show memory usage\n  top           - Show system processes\n  uptime        - Show system uptime\n  whoami        - Show current user\n  pwd           - Show current directory\n  clear         - Clear terminal\n  exit          - Close SSH session\n  help          - Show this help' 
                    });
                    break;
                default:
                    if (command.startsWith('cd ')) {
                        newHistory.push({ type: 'output', content: '' });
                    } else if (command.startsWith('mkdir ')) {
                        newHistory.push({ type: 'output', content: '' });
                    } else if (command.startsWith('touch ')) {
                        newHistory.push({ type: 'output', content: '' });
                    } else if (command.trim()) {
                        newHistory.push({ type: 'error', content: `bash: ${command}: command not found` });
                    }
            }
            
            newHistory.push({ type: 'prompt', content: `${connection?.username}@${connection?.host.split('.').pop()}:~$ ` });
            setHistory(newHistory);
            setCommand('');
            
            // Auto scroll to bottom
            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 100);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Simple tab completion for common commands
            const commands = ['ls', 'ps', 'df', 'free', 'top', 'uptime', 'whoami', 'pwd', 'clear', 'exit', 'help'];
            const matches = commands.filter(cmd => cmd.startsWith(command));
            if (matches.length === 1) {
                setCommand(matches[0]);
            }
        }
    };

    const copyToClipboard = () => {
        const terminalContent = history.map(item => item.content).join('\n');
        navigator.clipboard.writeText(terminalContent);
        toast.success('Terminal content copied to clipboard');
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setCommand(prev => prev + text);
            toast.success('Pasted from clipboard');
        } catch (err) {
            toast.error('Failed to paste from clipboard');
        }
    };

    const downloadLog = () => {
        const terminalContent = history.map(item => item.content).join('\n');
        const blob = new Blob([terminalContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ssh-session-${connection?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 19)}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('SSH session log downloaded');
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // Focus input after fullscreen toggle
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    if (!connection) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`bg-gray-900 border-gray-700 text-gray-100 p-0 flex flex-col ${
                isFullscreen ? 'w-screen h-screen max-w-none m-0 rounded-none' : 'max-w-5xl h-[80vh]'
            }`}>
                <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-700 p-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-emerald-400" />
                        <DialogTitle className="text-gray-100">SSH Console - {connection.name}</DialogTitle>
                        <Badge className={`${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={copyToClipboard} title="Copy terminal content">
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={downloadLog} title="Download session log">
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={toggleFullscreen} title="Toggle fullscreen">
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={onClose} title="Close">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 flex flex-col bg-black overflow-hidden">
                    <div 
                        ref={terminalRef}
                        className="flex-1 px-4 py-2 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {history.map((item, index) => (
                            <div key={index} className={`mb-1 ${
                                item.type === 'system' ? 'text-yellow-400' :
                                item.type === 'error' ? 'text-red-400' :
                                item.type === 'output' ? 'text-gray-300 whitespace-pre-wrap' :
                                item.type === 'input' ? 'text-emerald-400' :
                                'text-blue-400'
                            }`}>
                                {item.content}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border-t border-gray-700 shrink-0">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <Input
                            ref={inputRef}
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={handleCommand}
                            placeholder={isConnected ? "Type a command..." : "Not connected"}
                            disabled={!isConnected}
                            className="flex-1 bg-black border-gray-600 text-gray-100 font-mono"
                            autoFocus
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={pasteFromClipboard}
                            className="border-gray-600 hover:bg-gray-700"
                            title="Paste from clipboard (Ctrl+V)"
                        >
                            Paste
                        </Button>
                        <div className="text-xs text-gray-500">
                            ↑↓ History | Tab Complete | Enter Execute
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
