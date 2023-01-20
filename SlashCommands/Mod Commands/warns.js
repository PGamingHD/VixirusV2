const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json');
const fs = require("fs");

module.exports = {
    name: 'warns',
    description: 'View the warnings of a member.',
    module: 'mod',
    options: [{
        name: 'member',
        description: 'The member you wish to view the warnins of.',
        type: ApplicationCommandOptionType.User
    }],
    /** 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, interaction, con, args) => {
        let memberToView = interaction.options.getMember('member');

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***It seems like I do not currently have the \`Send Messages\` permission.***`)
                ],
                ephemeral: true
            });
        };

        if (!await client.warnCmd.has(`${interaction.guild.id}`)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setTitle(`:x: Error :x:`)
                    .setDescription(`***Woops, looks like this command is currently disabled.***`)
                ]
            })
        }

        if (!memberToView) memberToView = interaction.member;

        if (memberToView.user.bot) {
            return interaction.reply({
                content: ':x: Looks like that user is a bot, you may not check punishments for bots! :x:',
                ephemeral: true
            })
        }

        const totalWarns = await client.cachedWarns.get(`${interaction.guild.id}`);

        let totalWarnings = undefined;
        let warnArray = [];

        if (totalWarns !== undefined) {
            for (let i = 0; i < totalWarns.length; i++) {
                const element = totalWarns[i];
                if (element.target === memberToView.id) {
                    warnArray.push(element)
                };
            }
        }

        if (warnArray.length !== 0) {
            totalWarnings = warnArray;
        }

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
        const embeds = generatePunishments(totalWarnings, currentPage)
        let main = undefined;

        if (embeds.length > 1) {
            main = await interaction.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [mainRow],
                fetchReply: true
            })
        } else {
            main = await interaction.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [],
                fetchReply: true
            })
        }

        const filter = m => m.user.id === interaction.user.id;
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

                await interaction.editReply({
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
                        name: `Global Punishments for ${memberToView.user.username}#${memberToView.user.discriminator}`,
                        iconURL: memberToView.displayAvatarURL()
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
                        warningString = warningString + `---[${current[i].CaseID}]---\nModerator: ${current[i].mod}\nReason: ${current[i].reason}\nDate: ${current[i].date}\n\n`
                    }
                    const embed = new EmbedBuilder()
                        .setDescription(`\`\`\`${warningString}\`\`\``)
                        .setAuthor({
                            name: `Global Punishments for ${memberToView.user.username}#${memberToView.user.discriminator}`,
                            iconURL: memberToView.displayAvatarURL()
                        })
                        .setTitle(`:white_check_mark: Global Punishments :white_check_mark:`)
                        .setThumbnail(`https://cdn.discordapp.com/attachments/1010999257899204769/1053662138251624488/hammer.png`)
                        .setColor(ee.color)
                    embeds.push(embed)
                }
            }
            return embeds;
        }
    }
}