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
        useTheme404: true,
        bot: client,
        invite: {
            clientId: "1049070551232151622",
            scopes: ["bot", "applications.commands", "guilds"],
            permissions: '8',
            redirectUri: 'http://localhost/discord/callback',
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
                    enabled: true,
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