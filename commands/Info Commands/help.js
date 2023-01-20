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
    name: "help",
    aliases: ['commands', 'cmds'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        const prefix = client.cachedServerPrefixes.get(`${message.guild.id}`)

        const embed1 = new EmbedBuilder()
        embed1.setColor(ee.color)
        embed1.setTitle(`VixirusV2 Commands`)
        embed1.setDescription(`Client supports both Slash Commands & Prefixes, trigger the slash help with \`/help\` and prefix help with \`${prefix}help\`!`)
        embed1.addFields([{
            name: 'General',
            value: `A couple of general commands to start off or just get some extra knowledge.\n\`dashboard\`, \`invite\`, \`ping\``
        }, {
            name: 'Information',
            value: `A couple of commands to get some information about the client.\n\`help\`, \`punishments\`, \`status\``
        }, {
            name: 'Language',
            value: `Language related commands, switch language up.\n\`language\``,
        }, {
            name: 'Moderation',
            value: `Moderate your Servers with the bot.\n\`ban\`, \`clearwarns\`, \`kick\`, \`lockdown\`, \`mute\`, \`purge\`, \`removetimeout\`, \`removewarning\`, \`setnick\`, \`slowmode\`, \`softban\`, \`tempban\`, \`timeout\`, \`unban\`, \`unmute\`, \`warn\`, \`warns\``
        }])
        embed1.setFooter({
            text: 'Page 1 of 2'
        })
        const embed2 = new EmbedBuilder()
        embed2.setColor(ee.color)
        embed2.setTitle(`VixirusV2 Commands`)
        embed2.setDescription(`Client supports both Slash Commands & Prefixes, trigger the slash help with \`/help\` and prefix help with \`${prefix}help\`!`)
        embed2.addFields([{
            name: 'COMING SOON',
            value: `COMING SOON`
        }])
        embed2.setFooter({
            text: 'Page 2 of 2'
        })

        const helpEmbedsArray = [];
        helpEmbedsArray.push(embed1);
        helpEmbedsArray.push(embed2);

        //BUTTONS

        const mainRow = new ActionRowBuilder()
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('⏪')
            .setCustomId('fastbackward')
            .setStyle(ButtonStyle.Primary)
        ])
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('⬅️')
            .setCustomId('backward')
            .setStyle(ButtonStyle.Primary)
        ])
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('➡️')
            .setCustomId('forward')
            .setStyle(ButtonStyle.Primary)
        ])
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('⏩')
            .setCustomId('fastforward')
            .setStyle(ButtonStyle.Primary)
        ])
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('❌')
            .setCustomId('exit')
            .setStyle(ButtonStyle.Primary)
        ])

        let currentPage = 0;
        const embeds = generateHelpEmbed(helpEmbedsArray, currentPage)

        const main = await message.reply({
            embeds: [embeds[currentPage].setFooter({
                text: `Page ${currentPage+1} of ${embeds.length}`
            })],
            components: [mainRow],
            fetchReply: true
        })

        const filter = m => m.user.id === message.author.id;
        const collector = main.createMessageComponentCollector({
            filter,
            idle: 1000 * 60,
            time: 1000 * 120
        });

        collector.on('collect', async (interactionCollector) => {

            if (interactionCollector.customId === "forward") {
                await interactionCollector.deferUpdate();
                if (currentPage < embeds.length - 1) {
                    currentPage++;
                    interactionCollector.editReply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })]
                    })
                } else {
                    --currentPage;
                    interactionCollector.editReply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })]
                    })
                }
            }

            if (interactionCollector.customId === "backward") {
                await interactionCollector.deferUpdate();
                if (currentPage !== 0) {
                    --currentPage;
                    interactionCollector.editReply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })]
                    })
                } else {
                    currentPage++;
                    interactionCollector.editReply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })]
                    })
                }
            }

            if (interactionCollector.customId === "fastforward") {
                await interactionCollector.deferUpdate();
                if (currentPage < embeds.length - 1) {
                    currentPage = embeds.length - 1;
                    interactionCollector.editReply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })]
                    })
                }
            }

            if (interactionCollector.customId === "fastbackward") {
                await interactionCollector.deferUpdate();
                currentPage = 0;
                interactionCollector.editReply({
                    embeds: [embeds[currentPage].setFooter({
                        text: `Page ${currentPage+1} of ${embeds.length}`
                    })]
                })
            }

            if (interactionCollector.customId === "exit") {
                await interactionCollector.deferUpdate();
                collector.stop();
            }
        });

        collector.on('end', async (interactionCollected, reason) => {
            if (reason === "messageDelete") {
                return;
            }
            for (let i = 0; i < mainRow.components.length; i++) {
                mainRow.components[i].setDisabled(true);
            }

            await main.edit({
                components: [mainRow]
            });
        });

        function generateHelpEmbed(helpEmbedPage, currentPage) {
            const embeds = []
            let k = 1;
            for (let i = 0; i < helpEmbedPage.length; i += 1) {
                const current = helpEmbedPage.slice(i, k);
                let j = i;
                k += 1;
                const embed = new EmbedBuilder()
                    .setDescription(helpEmbedPage[i].data.description)
                    .setTitle(helpEmbedPage[i].data.title)
                    .addFields(helpEmbedPage[i].data.fields)
                    .setColor(helpEmbedPage[i].data.color)
                embeds.push(embed)
            }
            return embeds;
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/