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
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    let cpuStat = require("cpu-stat");
    let os = require("os");


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
                        .setLabel('Invite')
                        .setStyle(ButtonStyle.Link)
                    ])
                    buttonrow.addComponents([
                        new ButtonBuilder()
                        .setURL(`https://discord.gg/comingsoon`)
                        .setLabel('Support')
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
                        .setDescription(`I am the one and only VixirusV2, check my commands out with \`/help\`!`)
                        .addFields([{
                            name: `Birthday`,
                            value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}>`,
                            inline: true
                        }, {
                            name: `Joined On`,
                            value: `<t:${newjoined}>`,
                            inline: true
                        }, {
                            name: 'Bot Developer',
                            value: '[***PGamingHD***](https://discordapp.com/users/266726434855321600/)',
                            inline: true
                        }, {
                            name: 'Platform',
                            value: `\`\`[ ${platform} ]\`\``,
                            inline: true
                        }, {
                            name: 'Registered Commands',
                            value: `\`[ ${client.slashCommands.map((d) => d.options).flat().length.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: 'Cached Server(s)',
                            value: `\`[ ${client.guilds.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: 'Cached Channel(s)',
                            value: `\`[ ${client.channels.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: 'Cached User(s)',
                            value: `\`[ ${client.users.cache.size.toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: 'Total User(s)',
                            value: `\`[ ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0).toLocaleString('en-US')} ]\``,
                            inline: true
                        }, {
                            name: 'Uptime',
                            value: `\`[ ${prettyMilliseconds(client.uptime)} ]\``,
                            inline: true
                        }, {
                            name: 'Memory Usage',
                            value: `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2).toLocaleString('en-US')}mb ]\``,
                            inline: true
                        }, {
                            name: 'CPU Usage',
                            value: `\`[ ${percent.toFixed(2)}% ]\``,
                            inline: true
                        }, {
                            name: 'Host Location',
                            value: '\`[ Germany, Falkenstein ]\`',
                            inline: true
                        }, {
                            name: 'Bot Version',
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
                    content: ':x: Failed to send status message, please retry using the command again.'
                })
            }
        }
    }