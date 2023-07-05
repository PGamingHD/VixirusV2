const client = require("../../index");
const config = require("../../botconfig/config.json");
const emoji = require("../../botconfig/emojis.json");
const {
    Cron
} = require("croner");
const fs = require("fs");
const {
    ActivityType,
    Interaction
} = require("discord.js");
const chalk = require("chalk");
const {
    startupCooldown,
    maintenanceMode,
    blacklistedGuilds,
    blacklistedUsers,
    latestTOS,
    agreementDate,
} = require("../../index");

//TWITCH TESTING
const {
    ClientCredentialsAuthProvider
} = require('@twurple/auth');
const {
    ApiClient
} = require('@twurple/api');
const {
    DirectConnectionAdapter,
    EventSubListener
} = require('@twurple/eventsub');

client.on("ready", async (client) => {
    try {
        client.logger.log(`I successfully logged into ${client.user.tag} and started ALL services`, "ready");
        client.logger.log(`Entering bot cooldown for 60 seconds while the Database connects correctly`, "ready");

        Cron('0 */1 * * * *', () => {
            const currentMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100
            const file = fs.readFileSync('./botconfig/heapusage.json');

            const newfile = JSON.parse(file);

            const newObj = {
                "heap_1": currentMB,
                "heap_2": newfile['heap_1'],
                "heap_3": newfile['heap_2'],
                "heap_4": newfile['heap_3'],
                "heap_5": newfile['heap_4'],
                "heap_6": newfile['heap_5'],
                "heap_7": newfile['heap_6'],
                "heap_8": newfile['heap_7'],
                "heap_9": newfile['heap_8'],
                "heap_10": newfile['heap_9']
            }

            fs.writeFileSync('./botconfig/heapusage.json', JSON.stringify(newObj));
        });

        require("../../handler/loadcollections")(client);

        client.user.setActivity('In Development', {
            type: ActivityType.Watching
        });

    } catch (e) {
        client.logger.log(String(e.stack), 'error');
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/
