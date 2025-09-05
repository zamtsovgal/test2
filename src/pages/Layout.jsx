

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Server, 
  HardDrive, 
  Container, 
  Settings, 
  Activity,
  Zap,
  Shield,
  Mail,
  ShieldAlert,
  ListChecks,
  FileText,
  Users as UsersIcon,
  Plug
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster, toast } from "sonner";


const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Connections", url: createPageUrl("Connections"), icon: Plug },
  { title: "ESXi & vCenter", url: createPageUrl("ESXi"), icon: Server },
  { title: "Storage", url: createPageUrl("Storage"), icon: HardDrive },
  { title: "Docker", url: createPageUrl("Docker"), icon: Container },
  { title: "Services", url: createPageUrl("Services"), icon: ListChecks },
  { title: "Active Directory", url: createPageUrl("ActiveDirectory"), icon: UsersIcon },
];

const securityItems = [
  { title: "Syslog", url: createPageUrl("Syslog"), icon: FileText },
  { title: "Mail Relay", url: createPageUrl("MailRelay"), icon: Mail },
  { title: "EDR", url: createPageUrl("EDR"), icon: ShieldAlert },
];

const settingsItem = {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
};


export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const NavItem = ({ item }) => (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        className={`font-medium transition-all duration-200 rounded-lg mb-1 relative ${
          location.pathname === item.url 
          ? 'bg-blue-600/20 text-blue-300' 
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
        }`}
      >
        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
           {location.pathname === item.url && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-500 rounded-r-full"></div>
          )}
          <item.icon className="w-5 h-5" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900 text-gray-100">
        <Toaster richColors theme="dark" />
        <style>
          {`
            :root {
              --background: 17 24 39;
              --foreground: 243 244 246;
              --card: 31 41 55;
              --card-foreground: 243 244 246;
              --primary: 59 130 246;
              --primary-foreground: 255 255 255;
              --secondary: 75 85 99;
              --secondary-foreground: 243 244 246;
              --accent: 16 185 129;
              --accent-foreground: 255 255 255;
              --destructive: 239 68 68;
              --destructive-foreground: 255 255 255;
              --border: 55 65 81;
              --input: 55 65 81;
              --ring: 59 130 246;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-gray-700 bg-gray-800/50 backdrop-blur-xl">
          <SidebarHeader className="border-b border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-100">HomeLab</h2>
                <p className="text-xs text-gray-400 font-medium">Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3 flex flex-col justify-between">
            <div>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Monitoring
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => <NavItem key={item.title} item={item} />)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-4">
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Security
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {securityItems.map((item) => <NavItem key={item.title} item={item} />)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            <div>
              <SidebarGroup>
                 <SidebarGroupContent>
                    <SidebarMenu>
                       <NavItem item={settingsItem} />
                    </SidebarMenu>
                 </SidebarGroupContent>
              </SidebarGroup>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-700 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-100 text-sm truncate">Administrator</p>
                <p className="text-xs text-gray-400 truncate">Homelab Manager</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-900">
          <header className="bg-gray-800/50 border-b border-gray-700 px-6 py-4 md:hidden backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-100">{currentPageName}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

