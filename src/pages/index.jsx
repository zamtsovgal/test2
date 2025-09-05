import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import ESXi from "./ESXi";

import NAS from "./NAS";

import Docker from "./Docker";

import Settings from "./Settings";

import Syslog from "./Syslog";

import MailRelay from "./MailRelay";

import EDR from "./EDR";

import Services from "./Services";

import ActiveDirectory from "./ActiveDirectory";

import Connections from "./Connections";

import Storage from "./Storage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    ESXi: ESXi,
    
    NAS: NAS,
    
    Docker: Docker,
    
    Settings: Settings,
    
    Syslog: Syslog,
    
    MailRelay: MailRelay,
    
    EDR: EDR,
    
    Services: Services,
    
    ActiveDirectory: ActiveDirectory,
    
    Connections: Connections,
    
    Storage: Storage,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/ESXi" element={<ESXi />} />
                
                <Route path="/NAS" element={<NAS />} />
                
                <Route path="/Docker" element={<Docker />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Syslog" element={<Syslog />} />
                
                <Route path="/MailRelay" element={<MailRelay />} />
                
                <Route path="/EDR" element={<EDR />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/ActiveDirectory" element={<ActiveDirectory />} />
                
                <Route path="/Connections" element={<Connections />} />
                
                <Route path="/Storage" element={<Storage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}