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
    name: "punishments",
    aliases: ['punishs', 'punishment'],
    userPerms: [],
    clientPerms: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => {
        let member = message.mentions.users.first();

        if (!member) {
            member = message.author;
        }

        if (member.bot) {
            return message.reply({
                content: ':x: Looks like that user is a bot, you may not check punishments for bots! :x:',
                ephemeral: true
            })
        }

        const globalPunishments = client.globalPunishments.get(`${member.id}`);

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
        const embeds = generatePunishments(globalPunishments, currentPage)
        let main = undefined;

        if (embeds.length !== 0 && embeds.length !== 1) {
            main = await message.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [mainRow],
                fetchReply: true
            })
        } else {
            main = await message.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [],
                fetchReply: true
            })
        }

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
            if (reason === "messageDelete" || embeds.length <= 5) {
                return;
            } else {
                for (let i = 0; i < mainRow.components.length; i++) {
                    mainRow.components[i].setDisabled(true);
                }
    
                await main.edit({
                    components: [mainRow]
                });
            }
        });

        function generatePunishments(punishmentsPage, currentPage) {
            const embeds = []
            let k = 5;
            if (punishmentsPage === undefined) {
                const embed = new EmbedBuilder()
                .setDescription(`\`\`\`No warnings\`\`\``)
                .setAuthor({
                    name: `Global Punishments for ${member.username}#${member.discriminator}`,
                    iconURL: member.displayAvatarURL()
                })
                .setTitle(`:white_check_mark: Global Punishments :white_check_mark:`)
                .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                .setColor(ee.color)
                embeds.push(embed)
            } else {
                for (let i = 0; i < punishmentsPage.length; i += 5) {
                    const current = punishmentsPage.slice(i, k);
                    let j = i;
                    k += 1;
                    let warningString = "";
                    for (let i = 0; i < current.length; i++) {
                        warningString = warningString + `---[${current[i].CaseID}]---\nServer: ${current[i].server}\nModerator: ${current[i].mod}\nPunishment: ${current[i].punishment}\nReason: ${current[i].reason}\nDate: ${current[i].date}\n\n`
                    }
                    const embed = new EmbedBuilder()
                        .setDescription(`\`\`\`${warningString}\`\`\``)
                        .setAuthor({
                            name: `Global Punishments for ${member.username}#${member.discriminator}`,
                            iconURL: member.displayAvatarURL()
                        })
                        .setTitle(`:white_check_mark: Global Punishments :white_check_mark:`)
                        .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                        .setColor(ee.color)
                    embeds.push(embed)
                }
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