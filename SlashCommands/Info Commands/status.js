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
        description: 'Get some general information about the status of Discmon!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            try {
                cpuStat.usagePercent(async function (e, percent, seconds) {
                    if (e) return console.log(String(e.stack));

                    const buttonrow = new ActionRowBuilder()
                    buttonrow.addComponents([
                        new ButtonBuilder()
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=1003056966706413689&permissions=517543939136&scope=bot%20applications.commands`)
                        .setLabel(await languageControl(interaction.guild, 'INVITE_LABEL'))
                        .setStyle(ButtonStyle.Link)
                    ])
                    buttonrow.addComponents([
                        new ButtonBuilder()
                        .setURL(`https://discord.gg/comingsoon`)
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
                            name: 'VixirusV2 Status',
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(ee.color)
                        .setDescription(await languageControl(interaction.guild, 'BOT_STATUS_DESC'))
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
                            value: `\`[ ${client.slashCommands.map((d) => d.options).flat().length.toLocaleString('en-US')} ]\``,
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