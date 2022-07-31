    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');

    module.exports = {
        name: 'help',
        description: 'Do something!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            const embed1 = new EmbedBuilder()
            embed1.setColor(ee.color)
            embed1.setTitle(`Discmon Commands - Main`)
            embed1.setDescription(`Information can be found on the slash command simply by typing the slash command.\nDon't know how to use slash commands? All slash commands are triggered by the prefix \`/\`!`)
            embed1.addFields([{
                name: 'Market',
                value: `The main Marketplace for selling and purchasing Pokémons.\n\`market\``
            }, {
                name: 'Configuration',
                value: `Configure the client to your own needs.\n\`redirect\``
            }, {
                name: 'Pokémon',
                value: `General Pokémon related commands.\n\`info\`, \`pokemons\`, \`select\``,
            }, {
                name: 'Shops',
                value: `Purchasing items from the shop.\n\`shop\`, \`store\``
            }, {
                name: 'Information',
                value: `Main information commands, will display both Pokémon and client info.\n\`help\`, \`status\`, \`profile\`, \`ping\``
            }, {
                name: 'Client',
                value: `Everything related to the bot-client, and starting your adventure.\n\`start\``
            }])
            embed1.setFooter({
                text: 'Page 1 of 2'
            })
            const embed2 = new EmbedBuilder()
            embed2.setColor(ee.color)
            embed2.setTitle(`Discmon Commands - Second`)
            embed2.setDescription(`Information can be found on the slash command simply by typing the slash command.\nDon't know how to use slash commands? All slash commands are triggered by the prefix \`/\`!`)
            embed2.addFields([{
                name: 'Catching',
                value: `\`catch\`, \`hint\``
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

            const main = await interaction.reply({
                embeds: [embeds[currentPage].setFooter({
                    text: `Page ${currentPage+1} of ${embeds.length}`
                })],
                components: [mainRow],
                fetchReply: true
            })

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
                if (reason === "messageDelete") {
                    return;
                }
                for (let i = 0; i < mainRow.components.length; i++) {
                    mainRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
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
                    const info = current.map(currentEmbed => `\`${currentEmbed.data.color}\``);
                    const embed = new EmbedBuilder()
                        .setDescription(`${info}`)
                        .setTitle(helpEmbedPage[i].data.title)
                        .addFields(helpEmbedPage[i].data.fields)
                        .setColor(helpEmbedPage[i].data.color)
                    embeds.push(embed)
                }
                return embeds;
            }
        }
    }