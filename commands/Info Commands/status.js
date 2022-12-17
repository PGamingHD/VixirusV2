const {
    Message,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json");
const ee = require("../../botconfig/embed.json");
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
let cpuStat = require("cpu-stat");
let os = require("os");
const {
    languageControl
} = require("../../handler/functions");

module.exports = {
    name: "status",
    aliases: ['stats', 'botstats'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => {
        try {
            cpuStat.usagePercent(async function (e, percent, seconds) {
                if (e) return console.log(String(e.stack));

                const buttonrow = new ActionRowBuilder()
                buttonrow.addComponents([
                    new ButtonBuilder()
                    .setURL(config.Discord_Links.invite_link_recommended)
                    .setLabel(await languageControl(message.guild, 'INVITE_LABEL'))
                    .setStyle(ButtonStyle.Link)
                ])
                buttonrow.addComponents([
                    new ButtonBuilder()
                    .setURL(config.Discord_Links.Support_Server)
                    .setLabel(await languageControl(message.guild, 'SUPPORT_LABEL'))
                    .setStyle(ButtonStyle.Link)
                ])

                const joinedat = await message.guild.members.fetch(`${config.BOT_CLIENTID}`);
                const newjoined = Math.floor(joinedat.joinedTimestamp / 1000);
                let platform;

                if (os.platform == "win32") {
                    platform = "Windows";
                }
                if (os.platform == "linux") {
                    platform = "Linux (Ubuntu)";
                }

                const botinfo = new EmbedBuilder()
                    .setAuthor({
                        name: 'VixirusV2 Status',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor(ee.color)
                    .setDescription(await languageControl(message.guild, 'BOT_STATUS_DESC'))
                    .addFields([{
                        name: await languageControl(message.guild, 'BIRTHDAY_LABEL'),
                        value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}>`,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'JOINEDON_LABEL'),
                        value: `<t:${newjoined}>`,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'BOTDEVELOPER_LABEL'),
                        value: '[***PGamingHD***](https://discordapp.com/users/266726434855321600/)',
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'PLATFORM_LABEL'),
                        value: `\`\`[ ${platform} ]\`\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'REGISTEREDCMDS_LABEL'),
                        value: `\`[ ${client.slashCommands.map((d) => d.options).flat().length.toLocaleString('en-US')} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'CACHEDSERVERS_LABEL'),
                        value: `\`[ ${client.guilds.cache.size.toLocaleString('en-US')} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'CACHEDCHANNELS_LABEL'),
                        value: `\`[ ${client.channels.cache.size.toLocaleString('en-US')} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'CACHEDUSERS_LABEL'),
                        value: `\`[ ${client.users.cache.size.toLocaleString('en-US')} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'TOTALUSERS_LABEL'),
                        value: `\`[ ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0).toLocaleString('en-US')} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'UPTIME_LABEL'),
                        value: `\`[ ${prettyMilliseconds(client.uptime)} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'MEMORY_LABEL'),
                        value: `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2).toLocaleString('en-US')}mb ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'CPU_LABEL'),
                        value: `\`[ ${percent.toFixed(2)}% ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'HOSTLOC_LABEL'),
                        value: '\`[ Germany, Falkenstein ]\`',
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'VERSION_LABEL'),
                        value: `\`[ ${config.BOT_VERSION} ]\``,
                        inline: true
                    }, {
                        name: await languageControl(message.guild, 'DASHBOARD_LABEL'),
                        value: `[W.I.P](https://discord.gg/xQFFRzhJu2)`,
                        inline: true
                    }])

                return message.reply({
                    embeds: [botinfo],
                    components: [buttonrow],
                });
            });
        } catch (e) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setDescription(await languageControl(message.guild, 'SENDMSG_FAILURE'))
                ]
            })
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/