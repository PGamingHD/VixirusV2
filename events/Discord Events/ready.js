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
const getPool = require("../../handler/database");

client.on("ready", async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log(chalk.green(`[LOGIN] <==> || I successfully logged into ${client.user.tag} and started ALL services || <==> [LOGIN]`));
            console.log(chalk.red(`[COOLDOWN] <==> || Entering bot cooldown for 60 seconds while the Database connects correctly! || <==> [COOLDOWN]`));
        } catch (error) {
            console.log(error)
        }

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

        //SET GUILD CACHED LANGUAGES!
        const pool = await getPool().getConnection();
        const [guilds, guildsRow] = await pool.query(`SELECT * FROM guild_data`);
        guilds.forEach(async (guild) => {

            //SETTINGS

            await client.cachedGuildLanguages.set(`${guild.guild_id}`, guild.guild_language);

            await client.cachedServerPrefixes.set(`${guild.guild_id}`, guild.guild_prefix);

            await client.cachedWelcomeMessages.set(`${guild.guild_id}`, guild.guild_welcome);
            if (guild.guild_welcomechannel === "") {
                await client.cachedWelcomeChannels.set(`${guild.guild_id}`, null);
            } else {
                await client.cachedWelcomeChannels.set(`${guild.guild_id}`, guild.guild_welcomechannel);
            }
            await client.cachedLeaveMessages.set(`${guild.guild_id}`, guild.guild_bye);
            if (guild.guild_byechannel === "") {
                await client.cachedLeaveChannels.set(`${guild.guild_id}`, null);
            } else {
                await client.cachedLeaveChannels.set(`${guild.guild_id}`, guild.guild_byechannel);
            }
            await client.cachedPrivateMessages.set(`${guild.guild_id}`, guild.guild_private);

            //MODULES

            if (guild.guild_welcomemodule) {
                await client.welcomemodule.set(`${guild.guild_id}`, "Welcome Enabled!");
            }

            if (guild.guild_joinmodule) {
                await client.joinmodule.set(`${guild.guild_id}`, "Join Enabled!");
            }

            if (guild.guild_leavemodule) {
                await client.leavemodule.set(`${guild.guild_id}`, "Leave Enabled!");
            }

            if (guild.guild_privatemodule) {
                await client.privatemodule.set(`${guild.guild_id}`, "Private Enabled!");
            }

            if (guild.guild_languagemodule) {
                await client.languagemodule.set(`${guild.guild_id}`, "Language Enabled!");
            }

            if (guild.guild_prefixmodule) {
                await client.prefixmodule.set(`${guild.guild_id}`, "Prefix Enabled!");
            }
        });
        await pool.release();

        client.user.setActivity('In Development', {
            type: ActivityType.Watching
        });

    } catch (e) {
        console.log(String(e.stack))
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/