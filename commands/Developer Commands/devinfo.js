const {
    Message,
    Client,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json')
const ee = require('../../botconfig/embed.json');
const config = require('../../botconfig/config.json');
const prettyMilliseconds = require('pretty-ms')

module.exports = {
    name: 'devinfo',
    aliases: ['devi', 'devinf'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.DEVELOPER_IDS.includes(message.author.id)) return;

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

        const devInfoEmbeds = [];
        let currentPage = 0;
        const guilds = client.guilds.cache.map(guild => {
            devInfoEmbeds.push(guild);
        })

        const embeds = generateDevEmbed(devInfoEmbeds, currentPage)

        let mainMsg;
        if (guilds.length > 20) {
            mainMsg = await message.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [mainRow],
                fetchReply: true
            })
        } else {
            mainMsg = await message.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                fetchReply: true
            })
        }

        const filter = m => m.user.id === message.author.id;
        const collector = mainMsg.createMessageComponentCollector({
            filter,
            idle: 1000 * 60,
            time: 1000 * 120
        });

        collector.on('collect', async (interactionCollector) => {
            //if (interactionCollector.user.id !== message.author.id) return console.log("NOT OWNER WHO TOUCHA MY SPAGHET") CHECK IF OWNER TOUCH, AND POSSIBLE REPLY?
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
        })

        collector.on('end', async (collected, reason) => {
            if (reason === "messageDelete") {
                return;
            } else {
                for (let i = 0; i < mainRow.components.length; i++) {
                    mainRow.components[i].setDisabled(true);
                }

                await mainMsg.edit({
                    components: [mainRow]
                });
            }
        })

        function generateDevEmbed(helpEmbedPage, currentPage) {
            const embeds = []
            let k = 20;
            for (let i = 0; i < helpEmbedPage.length; i += 20) {
                const current = helpEmbedPage.slice(i, k);
                let j = i;
                k += 1;
                const info = current.map(currentEmbed => `- ${currentEmbed}`).join('\n');
                const embed = new EmbedBuilder()
                    .setDescription(`\`\`\`yaml\n${info}\`\`\``)
                    .setTitle(`🤖 Total Servers 🤖`)
                    .setColor(ee.color)
                embeds.push(embed)
            }
            return embeds;
        }
    },
};