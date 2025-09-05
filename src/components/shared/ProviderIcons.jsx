
import React from 'react';

// Multiple icon sources for comprehensive coverage
const DASHBOARD_ICONS_CDN = 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/';
const DASHBOARD_ICONS_SVG = 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/';
const HOMELAB_ICONS_CDN = 'https://cdn.jsdelivr.net/gh/NX211/homer-icons/png/';

// Comprehensive mapping with multiple fallback sources
const officialLogos = {
    // Directory Services & Identity Providers - FIXED MAPPINGS
    'microsoft': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/microsoft.png',
    'azure': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/azure.png',
    'azure active directory': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/azure.png',
    'google workspace': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-workspace.png',
    'google-workspace': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-workspace.png',
    'google': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google.png',
    'ldap': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/openldap.png',
    'okta': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/okta.png',
    'auth0': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/auth0.png',
    'jumpcloud': 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/jumpcloud.png',
    
    // Core Infrastructure & Virtualization
    'vmware': `${DASHBOARD_ICONS_CDN}vmware.png`,
    'vcenter': `${DASHBOARD_ICONS_CDN}vmware-vcenter.png`,
    'esxi': `${DASHBOARD_ICONS_CDN}vmware-esxi.png`,
    'proxmox': `${DASHBOARD_ICONS_CDN}proxmox.png`,
    'hyper-v': `${DASHBOARD_ICONS_CDN}hyper-v.png`,
    'virtualbox': `${DASHBOARD_ICONS_CDN}virtualbox.png`,
    'qemu': `${DASHBOARD_ICONS_CDN}qemu.png`,
    'citrix': `${DASHBOARD_ICONS_CDN}citrix.png`,
    'nutanix': `${DASHBOARD_ICONS_CDN}nutanix.png`,
    
    // Containers & Orchestration
    'docker': `${DASHBOARD_ICONS_CDN}docker.png`,
    'portainer': `${DASHBOARD_ICONS_CDN}portainer.png`,
    'kubernetes': `${DASHBOARD_ICONS_CDN}kubernetes.png`,
    'rancher': `${DASHBOARD_ICONS_CDN}rancher.png`,
    'openshift': `${DASHBOARD_ICONS_CDN}openshift.png`,
    'nomad': `${DASHBOARD_ICONS_CDN}nomad.png`,
    'consul': `${DASHBOARD_ICONS_CDN}consul.png`,
    'vault': `${DASHBOARD_ICONS_CDN}vault.png`,
    'podman': `${DASHBOARD_ICONS_CDN}podman.png`,
    
    // Storage & NAS
    'synology': `${DASHBOARD_ICONS_CDN}synology.png`,
    'dsm': `${DASHBOARD_ICONS_CDN}synology-dsm.png`,
    'qnap': `${DASHBOARD_ICONS_CDN}qnap.png`,
    'truenas': `${DASHBOARD_ICONS_CDN}truenas.png`,
    'freenas': `${DASHBOARD_ICONS_CDN}freenas.png`,
    'unraid': `${DASHBOARD_ICONS_CDN}unraid.png`,
    'openmediavault': `${DASHBOARD_ICONS_CDN}openmediavault.png`,
    'nextcloud': `${DASHBOARD_ICONS_CDN}nextcloud.png`,
    'owncloud': `${DASHBOARD_ICONS_CDN}owncloud.png`,
    'seafile': `${DASHBOARD_ICONS_CDN}seafile.png`,
    'minio': `${DASHBOARD_ICONS_CDN}minio.png`,
    
    // Network Infrastructure
    'cisco': `${DASHBOARD_ICONS_CDN}cisco.png`,
    'ubiquiti': `${DASHBOARD_ICONS_CDN}ubiquiti.png`,
    'unifi': `${DASHBOARD_ICONS_CDN}unifi.png`,
    'mikrotik': `${DASHBOARD_ICONS_CDN}mikrotik.png`,
    'pfsense': `${DASHBOARD_ICONS_CDN}pfsense.png`,
    'opnsense': `${DASHBOARD_ICONS_CDN}opnsense.png`,
    'fortinet': `${DASHBOARD_ICONS_CDN}fortinet.png`,
    'fortigate': `${DASHBOARD_ICONS_CDN}fortigate.png`,
    'sophos': `${DASHBOARD_ICONS_CDN}sophos.png`,
    'netgear': `${DASHBOARD_ICONS_CDN}netgear.png`,
    'tp-link': `${DASHBOARD_ICONS_CDN}tp-link.png`,
    'asus': `${DASHBOARD_ICONS_CDN}asus.png`,
    'linksys': `${DASHBOARD_ICONS_CDN}linksys.png`,
    'd-link': `${DASHBOARD_ICONS_CDN}d-link.png`,
    
    // Security & VPN - FIXED PIHOLE
    'pihole': `${DASHBOARD_ICONS_CDN}pihole.png`,
    'pi-hole': `${DASHBOARD_ICONS_CDN}pihole.png`,
    'adguard': `${DASHBOARD_ICONS_CDN}adguard.png`,
    'adguardhome': `${DASHBOARD_ICONS_CDN}adguard-home.png`,
    'bitwarden': `${DASHBOARD_ICONS_CDN}bitwarden.png`,
    'vaultwarden': `${DASHBOARD_ICONS_CDN}vaultwarden.png`,
    '1password': `${DASHBOARD_ICONS_CDN}1password.png`,
    'lastpass': `${DASHBOARD_ICONS_CDN}lastpass.png`,
    'keepass': `${DASHBOARD_ICONS_CDN}keepass.png`,
    'wireguard': `${DASHBOARD_ICONS_CDN}wireguard.png`,
    'openvpn': `${DASHBOARD_ICONS_CDN}openvpn.png`,
    'tailscale': `${DASHBOARD_ICONS_CDN}tailscale.png`,
    'zerotier': `${DASHBOARD_ICONS_CDN}zerotier.png`,
    'authentik': `${DASHBOARD_ICONS_CDN}authentik.png`,
    'authelia': `${DASHBOARD_ICONS_CDN}authelia.png`,
    'keycloak': `${DASHBOARD_ICONS_CDN}keycloak.png`,
    
    // Web Servers & Reverse Proxies
    'nginx': `${DASHBOARD_ICONS_CDN}nginx.png`,
    'nginx-proxy-manager': `${DASHBOARD_ICONS_CDN}nginx-proxy-manager.png`,
    'apache': `${DASHBOARD_ICONS_CDN}apache.png`,
    'traefik': `${DASHBOARD_ICONS_CDN}traefik.png`,
    'caddy': `${DASHBOARD_ICONS_CDN}caddy.png`,
    'haproxy': `${DASHBOARD_ICONS_CDN}haproxy.png`,
    'envoy': `${DASHBOARD_ICONS_CDN}envoy.png`,
    'cloudflare': `${DASHBOARD_ICONS_CDN}cloudflare.png`,
    
    // Media Servers
    'plex': `${DASHBOARD_ICONS_CDN}plex.png`,
    'jellyfin': `${DASHBOARD_ICONS_CDN}jellyfin.png`,
    'emby': `${DASHBOARD_ICONS_CDN}emby.png`,
    'kodi': `${DASHBOARD_ICONS_CDN}kodi.png`,
    'tautulli': `${DASHBOARD_ICONS_CDN}tautulli.png`,
    'ombi': `${DASHBOARD_ICONS_CDN}ombi.png`,
    'overseerr': `${DASHBOARD_ICONS_CDN}overseerr.png`,
    'jellyseerr': `${DASHBOARD_ICONS_CDN}jellyseerr.png`,
    'petio': `${DASHBOARD_ICONS_CDN}petio.png`,
    'komga': `${DASHBOARD_ICONS_CDN}komga.png`,
    'kavita': `${DASHBOARD_ICONS_CDN}kavita.png`,
    'audiobookshelf': `${DASHBOARD_ICONS_CDN}audiobookshelf.png`,
    'navidrome': `${DASHBOARD_ICONS_CDN}navidrome.png`,
    'airsonic': `${DASHBOARD_ICONS_CDN}airsonic.png`,
    'subsonic': `${DASHBOARD_ICONS_CDN}subsonic.png`,
    
    // *Arr Suite
    'sonarr': `${DASHBOARD_ICONS_CDN}sonarr.png`,
    'radarr': `${DASHBOARD_ICONS_CDN}radarr.png`,
    'lidarr': `${DASHBOARD_ICONS_CDN}lidarr.png`,
    'readarr': `${DASHBOARD_ICONS_CDN}readarr.png`,
    'prowlarr': `${DASHBOARD_ICONS_CDN}prowlarr.png`,
    'bazarr': `${DASHBOARD_ICONS_CDN}bazarr.png`,
    'whisparr': `${DASHBOARD_ICONS_CDN}whisparr.png`,
    'mylar': `${DASHBOARD_ICONS_CDN}mylar.png`,
    'mylar3': `${DASHBOARD_ICONS_CDN}mylar3.png`,
    'lazylibrarian': `${DASHBOARD_ICONS_CDN}lazylibrarian.png`,
    
    // Download Clients - FIXED ALL MAPPINGS
    'transmission': `${DASHBOARD_ICONS_CDN}transmission.png`,
    'qbittorrent': `${DASHBOARD_ICONS_CDN}qbittorrent.png`,
    'deluge': `${DASHBOARD_ICONS_CDN}deluge.png`,
    'rutorrent': `${DASHBOARD_ICONS_CDN}rutorrent.png`,
    'rtorrent': `${DASHBOARD_ICONS_CDN}rutorrent.png`,
    'jackett': `${DASHBOARD_ICONS_CDN}jackett.png`,
    'nzbget': `${DASHBOARD_ICONS_CDN}nzbget.png`,
    'sabnzbd': `${DASHBOARD_ICONS_CDN}sabnzbd.png`,
    'nzbhydra': `${DASHBOARD_ICONS_CDN}nzbhydra2.png`,
    'nzbhydra2': `${DASHBOARD_ICONS_CDN}nzbhydra2.png`,
    
    // Monitoring & Observability
    'grafana': `${DASHBOARD_ICONS_CDN}grafana.png`,
    'prometheus': `${DASHBOARD_ICONS_CDN}prometheus.png`,
    'alertmanager': `${DASHBOARD_ICONS_CDN}alertmanager.png`,
    'jaeger': `${DASHBOARD_ICONS_CDN}jaeger.png`,
    'zipkin': `${DASHBOARD_ICONS_CDN}zipkin.png`,
    'elastic': `${DASHBOARD_ICONS_CDN}elastic.png`,
    'elasticsearch': `${DASHBOARD_ICONS_CDN}elasticsearch.png`,
    'logstash': `${DASHBOARD_ICONS_CDN}logstash.png`,
    'kibana': `${DASHBOARD_ICONS_CDN}kibana.png`,
    'influxdb': `${DASHBOARD_ICONS_CDN}influxdb.png`,
    'telegraf': `${DASHBOARD_ICONS_CDN}telegraf.png`,
    'chronograf': `${DASHBOARD_ICONS_CDN}chronograf.png`,
    'zabbix': `${DASHBOARD_ICONS_CDN}zabbix.png`,
    'nagios': `${DASHBOARD_ICONS_CDN}nagios.png`,
    'checkmk': `${DASHBOARD_ICONS_CDN}checkmk.png`,
    'netdata': `${DASHBOARD_ICONS_CDN}netdata.png`,
    'uptime-kuma': `${DASHBOARD_ICONS_CDN}uptime-kuma.png`,
    'uptimekuma': `${DASHBOARD_ICONS_CDN}uptime-kuma.png`,
    'uptimerobot': `${DASHBOARD_ICONS_CDN}uptimerobot.png`,
    'statping': `${DASHBOARD_ICONS_CDN}statping.png`,
    'healthchecks': `${DASHBOARD_ICONS_CDN}healthchecks.png`,
    'datadog': `${DASHBOARD_ICONS_CDN}datadog.png`,
    'newrelic': `${DASHBOARD_ICONS_CDN}newrelic.png`,
    'sentry': `${DASHBOARD_ICONS_CDN}sentry.png`,
    
    // Dashboards
    'heimdall': `${DASHBOARD_ICONS_CDN}heimdall.png`,
    'homer': `${DASHBOARD_ICONS_CDN}homer.png`,
    'organizr': `${DASHBOARD_ICONS_CDN}organizr.png`,
    'flame': `${DASHBOARD_ICONS_CDN}flame.png`,
    'homarr': `${DASHBOARD_ICONS_CDN}homarr.png`,
    'dashy': `${DASHBOARD_ICONS_CDN}dashy.png`,
    'sui': `${DASHBOARD_ICONS_CDN}sui.png`,
    
    // Home Automation
    'home-assistant': `${DASHBOARD_ICONS_CDN}home-assistant.png`,
    'homeassistant': `${DASHBOARD_ICONS_CDN}home-assistant.png`,
    'openhab': `${DASHBOARD_ICONS_CDN}openhab.png`,
    'domoticz': `${DASHBOARD_ICONS_CDN}domoticz.png`,
    'node-red': `${DASHBOARD_ICONS_CDN}node-red.png`,
    'nodered': `${DASHBOARD_ICONS_CDN}node-red.png`,
    'homebridge': `${DASHBOARD_ICONS_CDN}homebridge.png`,
    'esphome': `${DASHBOARD_ICONS_CDN}esphome.png`,
    'tasmota': `${DASHBOARD_ICONS_CDN}tasmota.png`,
    'zigbee2mqtt': `${DASHBOARD_ICONS_CDN}zigbee2mqtt.png`,
    'zwave-js-ui': `${DASHBOARD_ICONS_CDN}zwave-js-ui.png`,
    'zwavejs2mqtt': `${DASHBOARD_ICONS_CDN}zwavejs2mqtt.png`,
    'mosquitto': `${DASHBOARD_ICONS_CDN}mosquitto.png`,
    'mqtt': `${DASHBOARD_ICONS_CDN}mqtt.png`,
    
    // Databases
    'mysql': `${DASHBOARD_ICONS_CDN}mysql.png`,
    'mariadb': `${DASHBOARD_ICONS_CDN}mariadb.png`,
    'postgresql': `${DASHBOARD_ICONS_CDN}postgresql.png`,
    'postgres': `${DASHBOARD_ICONS_CDN}postgresql.png`,
    'mongodb': `${DASHBOARD_ICONS_CDN}mongodb.png`,
    'redis': `${DASHBOARD_ICONS_CDN}redis.png`,
    'cassandra': `${DASHBOARD_ICONS_CDN}cassandra.png`,
    'sqlite': `${DASHBOARD_ICONS_CDN}sqlite.png`,
    'phpmyadmin': `${DASHBOARD_ICONS_CDN}phpmyadmin.png`,
    'adminer': `${DASHBOARD_ICONS_CDN}adminer.png`,
    'pgadmin': `${DASHBOARD_ICONS_CDN}pgadmin.png`,
    'mongo-express': `${DASHBOARD_ICONS_CDN}mongo-express.png`,
    'couchdb': `${DASHBOARD_ICONS_CDN}couchdb.png`,
    
    // Cloud Providers - FIXED GOOGLE CLOUD
    'aws': `${DASHBOARD_ICONS_CDN}aws.png`,
    'amazon-web-services': `${DASHBOARD_ICONS_CDN}aws.png`,
    'azure': `${DASHBOARD_ICONS_CDN}azure.png`,
    'microsoft-365': `${DASHBOARD_ICONS_CDN}microsoft-365.png`,
    '365-admin': `${DASHBOARD_ICONS_CDN}microsoft-365.png`,
    'google-cloud': `${DASHBOARD_ICONS_CDN}google-cloud.png`,
    'gcp': `${DASHBOARD_ICONS_CDN}google-cloud.png`,
    'google cloud platform': `${DASHBOARD_ICONS_CDN}google-cloud.png`,
    'digitalocean': `${DASHBOARD_ICONS_CDN}digitalocean.png`,
    'linode': `${DASHBOARD_ICONS_CDN}linode.png`,
    'vultr': `${DASHBOARD_ICONS_CDN}vultr.png`,
    'hetzner': `${DASHBOARD_ICONS_CDN}hetzner.png`,
    'ovh': `${DASHBOARD_ICONS_CDN}ovh.png`,
    'cloudflare-tunnel': `${DASHBOARD_ICONS_CDN}cloudflare.png`,
    
    // Development & CI/CD
    'github': `${DASHBOARD_ICONS_CDN}github.png`,
    'gitlab': `${DASHBOARD_ICONS_CDN}gitlab.png`,
    'gitea': `${DASHBOARD_ICONS_CDN}gitea.png`,
    'forgejo': `${DASHBOARD_ICONS_CDN}forgejo.png`,
    'jenkins': `${DASHBOARD_ICONS_CDN}jenkins.png`,
    'drone': `${DASHBOARD_ICONS_CDN}drone.png`,
    'buildkite': `${DASHBOARD_ICONS_CDN}buildkite.png`,
    'bamboo': `${DASHBOARD_ICONS_CDN}bamboo.png`,
    'nexus': `${DASHBOARD_ICONS_CDN}nexus.png`,
    'artifactory': `${DASHBOARD_ICONS_CDN}artifactory.png`,
    'sonarqube': `${DASHBOARD_ICONS_CDN}sonarqube.png`,
    'code-server': `${DASHBOARD_ICONS_CDN}code-server.png`,
    'vscode': `${DASHBOARD_ICONS_CDN}visual-studio-code.png`,
    'gitpod': `${DASHBOARD_ICONS_CDN}gitpod.png`,
    
    // Communication & Collaboration
    'mattermost': `${DASHBOARD_ICONS_CDN}mattermost.png`,
    'rocket-chat': `${DASHBOARD_ICONS_CDN}rocket-chat.png`,
    'matrix': `${DASHBOARD_ICONS_CDN}matrix.png`,
    'element': `${DASHBOARD_ICONS_CDN}element.png`,
    'discord': `${DASHBOARD_ICONS_CDN}discord.png`,
    'slack': `${DASHBOARD_ICONS_CDN}slack.png`,
    'teams': `${DASHBOARD_ICONS_CDN}microsoft-teams.png`,
    'zoom': `${DASHBOARD_ICONS_CDN}zoom.png`,
    'jitsi': `${DASHBOARD_ICONS_CDN}jitsi.png`,
    'mumble': `${DASHBOARD_ICONS_CDN}mumble.png`,
    'teamspeak': `${DASHBOARD_ICONS_CDN}teamspeak.png`,
    
    // Backup & Sync
    'duplicati': `${DASHBOARD_ICONS_CDN}duplicati.png`,
    'duplicacy': `${DASHBOARD_ICONS_CDN}duplicacy.png`,
    'restic': `${DASHBOARD_ICONS_CDN}restic.png`,
    'borgbackup': `${DASHBOARD_ICONS_CDN}borgbackup.png`,
    'syncthing': `${DASHBOARD_ICONS_CDN}syncthing.png`,
    'resilio': `${DASHBOARD_ICONS_CDN}resilio-sync.png`,
    'crashplan': `${DASHBOARD_ICONS_CDN}crashplan.png`,
    'rclone': `${DASHBOARD_ICONS_CDN}rclone.png`,
    
    // Network Tools
    'speedtest': `${DASHBOARD_ICONS_CDN}speedtest.png`,
    'librespeed': `${DASHBOARD_ICONS_CDN}librespeed.png`,
    'nmap': `${DASHBOARD_ICONS_CDN}nmap.png`,
    'wireshark': `${DASHBOARD_ICONS_CDN}wireshark.png`,
    'ntopng': `${DASHBOARD_ICONS_CDN}ntopng.png`,
    'smokeping': `${DASHBOARD_ICONS_CDN}smokeping.png`,
    'fping': `${DASHBOARD_ICONS_CDN}fping.png`,
    
    // Utilities & CMS
    'wordpress': `${DASHBOARD_ICONS_CDN}wordpress.png`,
    'drupal': `${DASHBOARD_ICONS_CDN}drupal.png`,
    'ghost': `${DASHBOARD_ICONS_CDN}ghost.png`,
    'joomla': `${DASHBOARD_ICONS_CDN}joomla.png`,
    'mediawiki': `${DASHBOARD_ICONS_CDN}mediawiki.png`,
    'bookstack': `${DASHBOARD_ICONS_CDN}bookstack.png`,
    'outline': `${DASHBOARD_ICONS_CDN}outline.png`,
    'notion': `${DASHBOARD_ICONS_CDN}notion.png`,
    'obsidian': `${DASHBOARD_ICONS_CDN}obsidian.png`,
    'joplin': `${DASHBOARD_ICONS_CDN}joplin.png`,
    'trilium': `${DASHBOARD_ICONS_CDN}trilium.png`,
    'wiki-js': `${DASHBOARD_ICONS_CDN}wikijs.png`,
    'wikijs': `${DASHBOARD_ICONS_CDN}wikijs.png`,
    
    // Game Servers
    'minecraft': `${DASHBOARD_ICONS_CDN}minecraft.png`,
    'pterodactyl': `${DASHBOARD_ICONS_CDN}pterodactyl.png`,
    'steam': `${DASHBOARD_ICONS_CDN}steam.png`,
    'gameserver': `${DASHBOARD_ICONS_CDN}gameserver.png`,
    'factorio': `${DASHBOARD_ICONS_CDN}factorio.png`,
    'valheim': `${DASHBOARD_ICONS_CDN}valheim.png`,
    
    // IoT & Hardware
    'raspberry-pi': `${DASHBOARD_ICONS_CDN}raspberry-pi.png`,
    'arduino': `${DASHBOARD_ICONS_CDN}arduino.png`,
    'esp32': `${DASHBOARD_ICONS_CDN}esp32.png`,
    'esp8266': `${DASHBOARD_ICONS_CDN}esp8266.png`,
    
    // Additional Popular Services
    'filebrowser': `${DASHBOARD_ICONS_CDN}filebrowser.png`,
    'filerun': `${DASHBOARD_ICONS_CDN}filerun.png`,
    'calibre': `${DASHBOARD_ICONS_CDN}calibre.png`,
    'calibre-web': `${DASHBOARD_ICONS_CDN}calibre-web.png`,
    'freshrss': `${DASHBOARD_ICONS_CDN}freshrss.png`,
    'miniflux': `${DASHBOARD_ICONS_CDN}miniflux.png`,
    'wallabag': `${DASHBOARD_ICONS_CDN}wallabag.png`,
    'shaarli': `${DASHBOARD_ICONS_CDN}shaarli.png`,
    'linkding': `${DASHBOARD_ICONS_CDN}linkding.png`,
    'n8n': `${DASHBOARD_ICONS_CDN}n8n.png`,
    'nocodb': `${DASHBOARD_ICONS_CDN}nocodb.png`,
    'baserow': `${DASHBOARD_ICONS_CDN}baserow.png`,
    'invoice-ninja': `${DASHBOARD_ICONS_CDN}invoice-ninja.png`,
    'invoiceninja': `${DASHBOARD_ICONS_CDN}invoice-ninja.png`,
    'photoprism': `${DASHBOARD_ICONS_CDN}photoprism.png`,
    'immich': `${DASHBOARD_ICONS_CDN}immich.png`,
    'lychee': `${DASHBOARD_ICONS_CDN}lychee.png`,
    'piwigo': `${DASHBOARD_ICONS_CDN}piwigo.png`,
    'paperless-ngx': `${DASHBOARD_ICONS_CDN}paperless-ngx.png`,
    'paperless': `${DASHBOARD_ICONS_CDN}paperless-ngx.png`,
    'mealie': `${DASHBOARD_ICONS_CDN}mealie.png`,
    'tandoor': `${DASHBOARD_ICONS_CDN}tandoor.png`,
    'grocy': `${DASHBOARD_ICONS_CDN}grocy.png`,
    'monica': `${DASHBOARD_ICONS_CDN}monica.png`,
    'firefly-iii': `${DASHBOARD_ICONS_CDN}firefly-iii.png`,
    'actual': `${DASHBOARD_ICONS_CDN}actual.png`,
    'vikunja': `${DASHBOARD_ICONS_CDN}vikunja.png`,
    'kanboard': `${DASHBOARD_ICONS_CDN}kanboard.png`,
    'wekan': `${DASHBOARD_ICONS_CDN}wekan.png`,
    'focalboard': `${DASHBOARD_ICONS_CDN}focalboard.png`,
    'planka': `${DASHBOARD_ICONS_CDN}planka.png`,
    
    // Additional missing services
    'mach2': `${DASHBOARD_ICONS_CDN}mach2.png`,
    'mach-2': `${DASHBOARD_ICONS_CDN}mach2.png`,
    'mail-relay': `${DASHBOARD_ICONS_CDN}postfix.png`,
    'postfix': `${DASHBOARD_ICONS_CDN}postfix.png`,
    'sendmail': `${DASHBOARD_ICONS_CDN}sendmail.png`,
    'exim': `${DASHBOARD_ICONS_CDN}exim.png`,
    'dovecot': `${DASHBOARD_ICONS_CDN}dovecot.png`,
    'zimbra': `${DASHBOARD_ICONS_CDN}zimbra.png`,
    'exchange': `${DASHBOARD_ICONS_CDN}microsoft-exchange.png`,
    'gmail': `${DASHBOARD_ICONS_CDN}gmail.png`,
    'outlook': `${DASHBOARD_ICONS_CDN}outlook.png`,
    
    // Generic fallbacks with better icons
    'generic': `${DASHBOARD_ICONS_CDN}generic.png`,
    'server': `${DASHBOARD_ICONS_CDN}server.png`,
    'service': `${DASHBOARD_ICONS_CDN}service.png`,
    'application': `${DASHBOARD_ICONS_CDN}application.png`,
    'web': `${DASHBOARD_ICONS_CDN}web.png`,
    'database': `${DASHBOARD_ICONS_CDN}database.png`,
    'network': `${DASHBOARD_ICONS_CDN}network.png`,
    'security': `${DASHBOARD_ICONS_CDN}security.png`,
    'monitoring': `${DASHBOARD_ICONS_CDN}monitoring.png`,
    'backup': `${DASHBOARD_ICONS_CDN}backup.png`,
};

// Enhanced fallback component for services without official logos
const DefaultIcon = ({ name, ...props }) => {
    const getInitials = (serviceName) => {
        if (!serviceName) return '??';
        const words = serviceName.split(/[\s-_]+/).filter(word => word.length > 0);
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
    };

    const getGradientColor = (serviceName) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-red-500 to-red-600',
            'from-yellow-500 to-yellow-600',
            'from-indigo-500 to-indigo-600',
            'from-pink-500 to-pink-600',
            'from-teal-500 to-teal-600',
        ];
        const hash = serviceName ? serviceName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
        return colors[hash % colors.length];
    };

    return (
        <div 
            className={`w-full h-full bg-gradient-to-br ${getGradientColor(name)} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            {...props}
        >
            {getInitials(name)}
        </div>
    );
};

// Enhanced component to render official logos with comprehensive fallbacks
const OfficialLogoIcon = ({ name, customUrl, className, ...props }) => {
    const [imageError, setImageError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    // Comprehensive name normalization
    const normalizedName = React.useMemo(() => {
        if (!name) return '';
        return name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[._]/g, '-')
            .replace(/server|host|service/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .trim();
    }, [name]);
    
    // Try multiple variations to find the icon
    const logoUrl = React.useMemo(() => {
        if (customUrl) return customUrl;
        
        const variations = [
            normalizedName,
            name?.toLowerCase(),
            name?.toLowerCase().replace(/\s+/g, ''),
            name?.toLowerCase().replace(/\s+/g, '-'),
            name?.toLowerCase().replace(/[^a-z0-9]/g, ''),
            name?.toLowerCase().split(' ')[0], // First word only
        ].filter(Boolean);
        
        for (const variation of variations) {
            if (officialLogos[variation]) {
                return officialLogos[variation];
            }
        }
        
        return null;
    }, [name, customUrl, normalizedName]);
    
    if (!logoUrl || imageError) {
        return <DefaultIcon name={name} className={className} {...props} />;
    }

    // Special handling for the custom Okta logo to add a white background
    const isCustomOkta = customUrl && customUrl.includes('Okta_logo_2023svg.png');
    
    return (
        <div className={`relative ${className}`} {...props}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-700/50 animate-pulse rounded-lg" />
            )}
            <img
                src={logoUrl}
                alt={`${name} logo`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                } ${isCustomOkta ? 'bg-white rounded-md p-0.5' : ''}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    console.warn(`Failed to load icon for: ${name} from ${logoUrl}`);
                    setImageError(true);
                    setIsLoading(false);
                }}
                loading="lazy"
            />
        </div>
    );
};

export const ProviderIcon = ({ name, customUrl, ...props }) => {
    return <OfficialLogoIcon name={name} customUrl={customUrl} {...props} />;
};

// Helper function to get icon category
const getIconCategory = (iconName) => {
    const categories = {
        'Directory Services': ['microsoft', 'azure', 'azure active directory', 'google workspace', 'google-workspace', 'google', 'ldap', 'okta', 'auth0', 'jumpcloud'],
        'Virtualization': ['vmware', 'vcenter', 'esxi', 'proxmox', 'hyper-v', 'virtualbox', 'qemu', 'citrix', 'nutanix'],
        'Containers': ['docker', 'portainer', 'kubernetes', 'rancher', 'openshift', 'nomad', 'consul', 'vault', 'podman'],
        'Storage': ['synology', 'dsm', 'qnap', 'truenas', 'freenas', 'unraid', 'openmediavault', 'nextcloud', 'owncloud', 'seafile', 'minio'],
        'Network': ['cisco', 'ubiquiti', 'unifi', 'mikrotik', 'pfsense', 'opnsense', 'fortinet', 'fortigate', 'sophos', 'netgear', 'tp-link', 'asus', 'linksys', 'd-link'],
        'Security': ['pihole', 'pi-hole', 'adguard', 'adguardhome', 'bitwarden', 'vaultwarden', '1password', 'lastpass', 'keepass', 'wireguard', 'openvpn', 'tailscale', 'zerotier', 'authentik', 'authelia', 'keycloak'],
        'Web Server': ['nginx', 'nginx-proxy-manager', 'apache', 'traefik', 'caddy', 'haproxy', 'envoy', 'cloudflare'],
        'Media': [
            'plex', 'jellyfin', 'emby', 'kodi', 'tautulli', 'ombi', 'overseerr', 'jellyseerr', 'petio', 'komga', 'kavita',
            'sonarr', 'radarr', 'lidarr', 'readarr', 'prowlarr', 'bazarr', 'whisparr', 'mylar', 'mylar3', 'lazylibrarian',
            'audiobookshelf', 'navidrome', 'airsonic', 'subsonic'
        ],
        'Download': ['transmission', 'qbittorrent', 'deluge', 'rutorrent', 'rtorrent', 'jackett', 'prowlarr', 'nzbget', 'sabnzbd', 'nzbhydra', 'nzbhydra2'],
        'Monitoring': [
            'grafana', 'prometheus', 'alertmanager', 'jaeger', 'zipkin', 'elastic', 'elasticsearch', 'logstash', 'kibana',
            'influxdb', 'telegraf', 'chronograf', 'zabbix', 'nagios', 'checkmk', 'netdata', 'uptime-kuma', 'uptimekuma',
            'uptimerobot', 'statping', 'healthchecks', 'datadog', 'newrelic', 'sentry'
        ],
        'Dashboard': ['heimdall', 'homer', 'organizr', 'flame', 'homarr', 'dashy', 'sui'],
        'Home Automation': [
            'home-assistant', 'homeassistant', 'openhab', 'domoticz', 'node-red', 'nodered', 'homebridge', 'esphome', 'tasmota',
            'zigbee2mqtt', 'zwave-js-ui', 'zwavejs2mqtt', 'mosquitto', 'mqtt'
        ],
        'Database': ['mysql', 'mariadb', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'sqlite', 'phpmyadmin', 'adminer', 'pgadmin', 'mongo-express', 'couchdb'],
        'Cloud': ['aws', 'amazon-web-services', 'azure', 'microsoft-365', '365-admin', 'google-cloud', 'gcp', 'google cloud platform', 'digitalocean', 'linode', 'vultr', 'hetzner', 'ovh', 'cloudflare-tunnel'],
        'Development': ['github', 'gitlab', 'gitea', 'forgejo', 'jenkins', 'drone', 'buildkite', 'bamboo', 'nexus', 'artifactory', 'sonarqube', 'code-server', 'vscode', 'gitpod'],
        'Communication': ['mattermost', 'rocket-chat', 'matrix', 'element', 'discord', 'slack', 'teams', 'zoom', 'jitsi', 'mumble', 'teamspeak'],
        'Email & Messaging': ['mail-relay', 'postfix', 'sendmail', 'exim', 'dovecot', 'zimbra', 'exchange', 'gmail', 'outlook'],
        'Backup': ['duplicati', 'duplicacy', 'restic', 'borgbackup', 'syncthing', 'resilio', 'crashplan', 'rclone'],
        'Network Tools': ['speedtest', 'librespeed', 'nmap', 'wireshark', 'ntopng', 'smokeping', 'fping'],
        'Utilities & CMS': [
            'wordpress', 'drupal', 'ghost', 'joomla', 'mediawiki', 'bookstack', 'outline', 'notion', 'obsidian', 'joplin', 'trilium',
            'wiki-js', 'wikijs', 'filebrowser', 'filerun', 'calibre', 'calibre-web', 'freshrss', 'miniflux', 'wallabag', 'shaarli',
            'linkding', 'n8n', 'nocodb', 'baserow', 'invoice-ninja', 'invoiceninja', 'photoprism', 'immich', 'lychee', 'piwigo',
            'paperless-ngx', 'paperless', 'mealie', 'tandoor', 'grocy', 'monica', 'firefly-iii', 'actual', 'vikunja', 'kanboard',
            'wekan', 'focalboard', 'planka', 'mach2', 'mach-2'
        ],
        'Gaming': ['minecraft', 'pterodactyl', 'steam', 'gameserver', 'factorio', 'valheim'],
        'IoT': ['raspberry-pi', 'arduino', 'esp32', 'esp8266'],
    };
    
    // Normalize name for category lookup
    const normalizedIconName = iconName.toLowerCase();

    for (const [category, icons] of Object.entries(categories)) {
        if (icons.includes(normalizedIconName)) {
            return category;
        }
    }
    return 'Other';
};

// Export all available icons for the icon picker
export const getAllAvailableIcons = () => {
    return Object.keys(officialLogos).map(key => ({
        id: key,
        name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        category: getIconCategory(key),
        logoUrl: officialLogos[key],
    })).sort((a, b) => a.name.localeCompare(b.name));
};

// Helper function to search icons
export const searchIcons = (query, category = null) => {
    const allIcons = getAllAvailableIcons();
    
    return allIcons.filter(icon => {
        const matchesQuery = query === '' || 
            icon.name.toLowerCase().includes(query.toLowerCase()) ||
            icon.id.toLowerCase().includes(query.toLowerCase()) ||
            icon.category.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = category === null || 
            category === 'All' || 
            icon.category === category;
        
        return matchesQuery && matchesCategory;
    });
};

// Get unique categories
export const getIconCategories = () => {
    const allIcons = getAllAvailableIcons();
    const categories = [...new Set(allIcons.map(icon => icon.category))].sort();
    return ['All', ...categories];
};
