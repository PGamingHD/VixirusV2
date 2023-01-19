const config = require("../botconfig/config.json");
const client = require("../index");
const SoftUI = require('dbd-soft-ui');
const DBD = require('discord-dashboard');
const fs = require("fs");
const os = require("os");
require('dotenv').config();

/* --- DASHBOARD --- */
(async () => {
    await DBD.useLicense(config.Discord_Dashboard.Dashboard_license);
    DBD.Dashboard = DBD.UpdatedClass();

    const settingsArray = [];
    client.dashboardSettings.forEach(item => {
        const dashboardItem = require("../dashboard/settings/" + item + "/handler.js");
        settingsArray.push(dashboardItem);
    });

    const languageObject = {};
    client.dashboardLanguages.forEach(item => {
        const dashboardLang = require("../dashboard/languages/" + item);
        Object.assign(languageObject, dashboardLang);
    });

    const Dashboard = new DBD.Dashboard({
        port: config.Discord_Dashboard.Dashboard_port,
        client: config.Discord_Dashboard.Dashboard_client,
        redirectUri: `${config.Discord_Dashboard.Dashboard_domain}${config.Discord_Dashboard.Redirect_URI}`,
        domain: config.Discord_Dashboard.Dashboard_domain,
        ownerIDs: config.Discord_Dashboard.OwnerIDs,
        underMaintenanceAccessKey: 'PGsSecretMaintenanceKey1203589!#@',
        underMaintenanceAccessPage: '/admin',
        useUnderMaintenance: false,
        underMaintenance: {
            title: 'Under Maintenance',
            contentTitle: 'This page is under maintenance',
            texts: [
                '<br>',
                'We still want to change for the better for you.',
                'Therefore, we are introducing technical updates so that we can allow you to enjoy the quality of our services.',
                '<br>',
                `Come back to us later or join our <a href="${config.Discord_Links.Support_Server}">Discord Support Server</a>`
            ],
            bodyBackgroundColors: ['#ffa191', '#ffc247'],
            buildingsColor: '#ff6347',
            craneDivBorderColor: '#ff6347',
            craneArmColor: '#f88f7c',
            craneWeightColor: '#f88f7c',
            outerCraneColor: '#ff6347',
            craneLineColor: '#ff6347',
            craneCabinColor: '#f88f7c',
            craneStandColors: ['#ff6347', , '#f29b8b']
        },
        SSL: {
            enabled: true,
            cert: `-----BEGIN CERTIFICATE-----
MIIFHDCCBASgAwIBAgISA4GHtieoaeIq6GzO/u+jhWuxMA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yMzAxMDgxMzQ4MjNaFw0yMzA0MDgxMzQ4MjJaMBYxFDASBgNVBAMT
C2x1YWxvY2suY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MKj
sZxEc5Duh5GJFQyYHtXo4Z1GM2q2PjExrj+WFDnh8FD/amstdFZUnkUBXZhV+ltM
Y5ReMKiMebMgWNykwFtH8kpeirdL6f++VpwfX2WDkzUPIvJwPczM6682xK9+P05x
rnuDXjvaihVIwj+jA64Y7fXk2RGffnvHE+gZBLjrhaCsIdjjpC7KDp2cG5N+PWAl
7fXNKCUO8RMQCmSfvu3JC7JB3L5Y4MWKTBvFEW+W4CIJ0F2tvHBL0mg12JO5HbfZ
/D5MbEdcox+FkpLvi6+7JStUDi1KoN5fEv3gT0Qk76pIrZccO3mlmIvHBNLViI0e
rPJMSHk2DMMuKxMkTwIDAQABo4ICRjCCAkIwDgYDVR0PAQH/BAQDAgWgMB0GA1Ud
JQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAAMB0GA1UdDgQW
BBQnQUXUnP7IByyzwQUpmX9/S8n9FDAfBgNVHSMEGDAWgBQULrMXt1hWy65QCUDm
H6+dixTCxjBVBggrBgEFBQcBAQRJMEcwIQYIKwYBBQUHMAGGFWh0dHA6Ly9yMy5v
LmxlbmNyLm9yZzAiBggrBgEFBQcwAoYWaHR0cDovL3IzLmkubGVuY3Iub3JnLzAW
BgNVHREEDzANggtsdWFsb2NrLmNvbTBMBgNVHSAERTBDMAgGBmeBDAECATA3Bgsr
BgEEAYLfEwEBATAoMCYGCCsGAQUFBwIBFhpodHRwOi8vY3BzLmxldHNlbmNyeXB0
Lm9yZzCCAQQGCisGAQQB1nkCBAIEgfUEgfIA8AB2AOg+0No+9QY1MudXKLyJa8kD
08vREWvs62nhd31tBr1uAAABhZHape4AAAQDAEcwRQIgXYsekeM8f6iQx4AzGsdy
s25pzD/YFlpxnVjeQGtrm3sCIQDoqJjP+w/fLEkj+vPI+6cxFmjXQaS57MOX3LtY
Cf1PLAB2ALc++yTfnE26dfI5xbpY9Gxd/ELPep81xJ4dCYEl7bSZAAABhZHap+UA
AAQDAEcwRQIgW8gEQWgimLiYSushf9+JG3TXc6ZREv1tKOZVyiiY7DECIQDcr3Og
g7NLuXqgvMnR4zRlkxOae0CJvDVxaWEWgviUqjANBgkqhkiG9w0BAQsFAAOCAQEA
gVJPC6l+9mOifFzlerWApBQB8N2e7AKrZTBoEz1mU6dz2rkVFKDY6n9JEYLktdlv
NuNr6aP7SF/rtWlUDtYNuDXPQk9QU0kQN9dUEFocDldWV2BvEEICOfjG+kXOurfF
u0S9QfpUgZVEXqHT3dsV+i6cehNBiIFYmcLfogdHpEnK0LoJH3OmYJUXD7VgQzPa
kEmvK2Hd68tDAPPhaF2do1p9UoC0siHskB2Dp//1qj6pahh+LYvLJTW+753O6WWC
+WaSwVpxsgaMocsXdyA0SFG/Lnqf9ppgUirgtW+PoILd6xI99XxYTd8PFmeK8Wx8
/9R1lXFtcC35LLmVCr0IRw==
-----END CERTIFICATE-----`,
            key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQwqOxnERzkO6H
kYkVDJge1ejhnUYzarY+MTGuP5YUOeHwUP9qay10VlSeRQFdmFX6W0xjlF4wqIx5
syBY3KTAW0fySl6Kt0vp/75WnB9fZYOTNQ8i8nA9zMzrrzbEr34/TnGue4NeO9qK
FUjCP6MDrhjt9eTZEZ9+e8cT6BkEuOuFoKwh2OOkLsoOnZwbk349YCXt9c0oJQ7x
ExAKZJ++7ckLskHcvljgxYpMG8URb5bgIgnQXa28cEvSaDXYk7kdt9n8PkxsR1yj
H4WSku+Lr7slK1QOLUqg3l8S/eBPRCTvqkitlxw7eaWYi8cE0tWIjR6s8kxIeTYM
wy4rEyRPAgMBAAECggEAB2piljSO2ewUDQzGadEAtley5hDIJZtszdjBgwcPNbi4
pei6qfUUsEVAzD53RfPbWgFUPVVP4zqZgtkyFPYBhDO54olxwkuwjqdfA4SYOLNK
cTg5SWyDQC6+OMEImQQC4AzRTPlmOTq3EKCg7QWFrOPKTumlL3DI0Z1j/PkJqnk2
tysVlZAEqPPGQQrHz1dklGNgreV/jDotk+GdmgcZMoc4TSfGLy6fKRJovIevtH3w
WZZequ5NHUHiKFnjz/fOPPFtF/a6yM08OVJBTl+5j4eMSktJYqY62bq1trtBKbE8
GmzlKTjpH80DNV5mL6vnNm2+seffwVen1bLMlJ5/AQKBgQDr7gxIdXCIKHJGi+Mi
F/48KbQ0PyVCJWZM+VAaUuZ2A+hqARcPeAUl6SUGwytnJoP21EpvPNWiMU/GsDq6
k9AY6cwKSdLkBrJtdpOLbk+7ckp4lKcw87qOCFoKXRcvXTGK8l3eNtG+Oq0mC5WK
8GbpccdQtVZTBVrdkxVfhrM4sQKBgQDihOhSAgEvY++gAw308TJMN769o5Qffpi7
JLdcPnQholfBFuoBPl3j02K79DgJ4mHbCjk5qdudL77vVaLoJnSl1rULXYunyd5H
TiTCplk0LmMUncIxZ+gD26TxJKPX/T7Uh044htFs4VVniUQjqN2Hizsf0fA+oG8m
nzesZZNs/wKBgEGNLYqAXtjl7AJf4abaZcAPkksl9FMxkv/2EWSO/gtyQIQbc23P
2hZTdf8wAQIy+F1/VIMdsvnSm6jH1Dl80kfpxdBh/J9woOi7FnmaF7ssITbpjp6S
SZYnCeVxQfzd9uL1PlF8h8BEC1HTzCQDcYSRIWDyUV7V0Q5ZTInzIh6xAoGAMCE3
T713TP95+dDMVWAuZL1vfNHV9j8q6pCpmSL3//GDndZlkDAVOQRANVl10rvUOPta
H2N081gixK24eIU7QcV2IF0XAGbHIPV8oBNCXvEAQnAmw+KlDLTNviMf4RPBFt1N
BHu44d6bC+3BmaYWs+ckf+VWm6fxFg68gJfwlDcCgYB1dK61Blaj+DuMRelZdiW8
ARAKWbA4wt3epC4B371OeaLYgSsbbIQse2yVeD3GsIM8rk0YiwwiKz3CalpT32JX
ZKoD/rtSiNrZm4O9sN34PtsqyOPxDf8u9T7Ha+9ZSJQR0atnLLCR4nbHAf0QsfcT
6OmLcHSM+LzMsmgaIbd9+g==
-----END PRIVATE KEY-----`
        },
        useTheme404: true,
        bot: client,
        invite: {
            clientId: "1049070551232151622",
            scopes: ["bot", "applications.commands", "guilds"],
            permissions: '8',
            redirectUri: 'https://lualock.com/discord/callback',
        },
        supportServer: {
            slash: '/support',
            inviteUrl: config.Discord_Links.Support_Server
        },
        guildAfterAuthorization: {
            use: true,
            guildId: '1010999169676222514'
        },
        theme: SoftUI({
            customThemeOptions: {
                index: async ({
                    req,
                    res,
                    config
                }) => {

                    let percentageServers = 0;
                    let serverText = "";
                    if (req.session.user && req.session.user.premium_type === 2) {
                        serverText = " out of 200",
                            percentageServers = Math.floor(req.session.guilds.length / 200 * 100);
                    } else {
                        serverText = " out of 100"
                        if (req.session.user) {
                            percentageServers = req.session.guilds.length;
                        }
                    }

                    let platform;
                    if (os.platform == "win32") {
                        platform = "Windows";
                    }
                    if (os.platform == "linux") {
                        platform = "Linux";
                    }

                    const cards = [{
                            title: "Current User",
                            icon: "single-02",
                            getValue: req.session.user ? req.session.user.username : "Not logged in",
                            progressBar: {
                                enabled: false,
                                getProgress: 50
                            }
                        },
                        {
                            title: "CPU",
                            icon: "atom",
                            getValue: os.cpus()[0].model,
                            progressBar: {
                                enabled: false,
                                getProgress: 50
                            }
                        },
                        {
                            title: "System Platform",
                            icon: "laptop",
                            getValue: platform,
                            progressBar: {
                                enabled: false,
                                getProgress: 50
                            }
                        },
                        {
                            title: "Server Count",
                            icon: "settings-gear-65",
                            getValue: req.session.user ? req.session.guilds.length + serverText : "Not logged in",
                            progressBar: {
                                enabled: true,
                                getProgress: percentageServers === 0 ? 100 : percentageServers,
                            }
                        }
                    ]

                    const file = fs.readFileSync('./botconfig/heapusage.json');

                    const heapfile = JSON.parse(file);

                    const graph = {
                        values: [heapfile['heap_1'], heapfile['heap_2'], heapfile['heap_3'], heapfile['heap_4'], heapfile['heap_5'], heapfile['heap_6'], heapfile['heap_7'], heapfile['heap_8'], heapfile['heap_9'], heapfile['heap_10']],
                        labels: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m"]
                    }

                    return {
                        cards,
                        graph
                    }
                },
            },
            dbdriver: "mysql://" + process.env.MYSQL_USER + ":" + process.env.MYSQL_PASS + "@localhost" + ":" + process.env.MYSQL_PORT + "/" + process.env.MYSQL_DATABASE,
            locales: languageObject,
            websiteName: "VixirusV2",
            colorScheme: "dark",
            supporteMail: "vixirusv2@support.com",
            icons: {
                favicon: 'https://cdn.discordapp.com/attachments/1010999257899204769/1049330037666627704/VixirusV2-logoremade.png',
                noGuildIcon: "https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png",
                sidebar: {
                    darkUrl: 'https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png',
                    lightUrl: 'https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png',
                    hideName: true,
                    borderRadius: false,
                    alignCenter: true
                },
            },
            preloader: {
                image: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
                spinner: false,
                text: "Page is loading",
            },
            index: {
                card: {
                    category: "VixirusV2 Announcements",
                    title: "VixirusV2 - Coming Soon",
                    description: "yo",
                    image: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
                    link: {
                        text: "Join our Support Server here!",
                        enabled: true,
                        url: '/support'
                    }
                },
                graph: {
                    enabled: true,
                    lineGraph: false,
                    title: 'Memory Usage',
                    tag: 'Memory (MB)',
                    max: 100
                },
            },
            premium: {
                enabled: true,
                card: {
                    title: "Want more from VixirusV2?",
                    description: "Check out premium features below!",
                    bgImage: "https://cdn.discordapp.com/attachments/1010999257899204769/1049330037666627704/VixirusV2-logoremade.png",
                    button: {
                        text: "Become Premium",
                        url: "https://patreon.com/comingsoon"
                    }
                }
            },
            sweetalert: {
                errors: {},
                success: {
                    login: "Successfully logged in.",
                }
            },
            admin: {
                pterodactyl: {
                    enabled: false,
                    apiKey: "apiKey",
                    panelLink: "https://panel.website.com",
                    serverUUIDs: []
                }
            },
            commands: [],
        }),
        settings: settingsArray
    });
    Dashboard.init();
})();