    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        ActionRowBuilder,
        MessageButton,
        ButtonStyle,
        ButtonBuilder,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const embed = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    let cpuStat = require("cpu-stat");
    let os = require("os");
    const {
        languageControl,
        stringTemplateParser
    } = require("../../handler/functions");


    module.exports = {
        name: 'status',
        description: 'Get some general information about the status of the client',
        userPerms: [],
        clientPerms: [],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            try {
                const secondsUptime = Math.floor(client.uptime / 1000);
                const cmdsPerSecond = client.messagesSent / secondsUptime;

                cpuStat.usagePercent(async function (e, percent, seconds) {
                    if (e) return console.log(String(e.stack));

                    const buttonrow = new ActionRowBuilder()
                    buttonrow.addComponents([
                        new ButtonBuilder()
                        .setURL(config.Discord_Links.invite_link_recommended)
                        .setLabel(await languageControl(interaction.guild, 'INVITE_LABEL'))
                        .setStyle(ButtonStyle.Link)
                    ])
                    buttonrow.addComponents([
                        new ButtonBuilder()
                        .setURL(config.Discord_Links.Support_Server)
                        .setLabel(await languageControl(interaction.guild, 'SUPPORT_LABEL'))
                        .setStyle(ButtonStyle.Link)
                    ])

                    const joinedat = await interaction.guild.members.fetch(`${config.BOT_CLIENTID}`);
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
                            name: client.user.username + ' Status',
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(ee.color)
                        .setDescription(`I am the one and only ${client.user.username}, check my commands out with \`/help\`!\n\n**Events since last restart \`${prettyMilliseconds(client.uptime)}\` ago:**\n• **${client.messagesSent.toLocaleString('en-US')}** message processed\n• **${cmdsPerSecond.toFixed(2).toLocaleString('en-US')}** messages per second`)
                        .addFields([{
                            name: await languageControl(interaction.guild, 'BIRTHDAY_LABEL'),
                            value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}>`,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'JOINEDON_LABEL'),
                            value: `<t:${newjoined}>`,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'BOTDEVELOPER_LABEL'),
                            value: '[***PGamingHD***](https://discordapp.com/users/266726434855321600/)',
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'PLATFORM_LABEL'),
                            value: `\`\`[ ${platform} ]\`\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'REGISTEREDCMDS_LABEL'),
                            value: `\`[ ${client.interactionCommands.map((d) => d.options).flat().length.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'CACHEDSERVERS_LABEL'),
                            value: `\`[ ${client.guilds.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'CACHEDCHANNELS_LABEL'),
                            value: `\`[ ${client.channels.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'CACHEDUSERS_LABEL'),
                            value: `\`[ ${client.users.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'TOTALUSERS_LABEL'),
                            value: `\`[ ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0).toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'UPTIME_LABEL'),
                            value: `\`[ ${prettyMilliseconds(client.uptime)} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'MEMORY_LABEL'),
                            value: `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2).toLocaleString('en-US')}mb ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'CPU_LABEL'),
                            value: `\`[ ${percent.toFixed(2)}% ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'HOSTLOC_LABEL'),
                            value: '\`[ Germany, Falkenstein ]\`',
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'VERSION_LABEL'),
                            value: `\`[ ${config.BOT_VERSION} ]\``,
                            inline: true
                        }, {
                            name: await languageControl(interaction.guild, 'DASHBOARD_LABEL'),
                            value: `[Dashboard](${config.Discord_Dashboard.Dashboard_domain})`,
                            inline: true
                        }])

                    return interaction.reply({
                        embeds: [botinfo],
                        components: [buttonrow],
                    });
                });
            } catch (e) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(embed.color)
                        .setDescription(await languageControl(interaction.guild, 'SENDMSG_FAILURE'))
                    ]
                })
            }
        }
    }