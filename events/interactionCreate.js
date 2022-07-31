const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Discord,
    ModalBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    WebhookClient,
    PermissionFlagsBits
} = require("discord.js");
const client = require("../index");
const ee = require("../botconfig/embed.json");
const emoji = require("../botconfig/emojis.json");
const config = require("../botconfig/config.json");
const embed = require("../botconfig/embed.json");
const startupCooldown = client.startupCooldown;

client.on("interactionCreate", async (interaction) => {

    if (startupCooldown.has("startupcooldown") && !config.DEVELOPER_IDS.includes(interaction.user.id)) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setDescription(`:x: The bot is still starting up, please be patient and wait for the cooldown to end!`)
            ]
        })
    }

    const [globalRows, globalFields] = await client.connection.query('SELECT * FROM global_data WHERE global_access = 1');
    const inMaintenance = globalRows[0].maintenance_mode;
    const latestTOS = globalRows[0].latest_tos;

    if (inMaintenance && !config.DEVELOPER_IDS.includes(interaction.user.id)) {

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.maintenanceColor)
                .setDescription(`:x: Maintenance Mode is enabled, please wait until the maintenance is over!`)
            ]
        })
    }

    const [blacklistGuildRows, blacklistGuildFields] = await client.connection.query(`SELECT * FROM blacklist_data WHERE blacklist_type = "GUILD" AND blacklist_id = "${interaction.guild.id}"`);
    if (blacklistGuildRows.length !== 0) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setTitle(':x: Blacklist Detected :x:')
                .setDescription(`This server has been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.`)
            ]
        })
    }

    const [blacklistUserRows, blacklistUserFields] = await client.connection.query(`SELECT * FROM blacklist_data WHERE blacklist_type = "USER" AND blacklist_id = "${interaction.user.id}"`);
    if (blacklistUserRows.length !== 0) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setTitle(':x: Blacklist Detected :x:')
                .setDescription(`You have been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.`)
            ]
        })
    }

    const [tosAgreementRows, tosAgreementFields] = await client.connection.query(`SELECT * FROM tos_agreements WHERE agreement_userid = ${interaction.user.id}`);

    let existingAgreement = 0;

    if(tosAgreementRows.length !== 0) {
        existingAgreement = tosAgreementRows[0].agreement_date;
    }

    if (latestTOS > existingAgreement && !interaction.isButton()) {
        const agreementRow = new ActionRowBuilder()
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('✅')
            .setCustomId('agree')
            .setStyle(ButtonStyle.Primary)
        ])
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('❎')
            .setCustomId('disagree')
            .setStyle(ButtonStyle.Primary)
        ])

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`Updated Terms of Service agreement!`)
                .setDescription(`**Whoops, wait one second there ${interaction.user}!**\n\nLooks like you have yet to read our newly updated [Terms of Service](https://discord.gg/discmon) and agree to it.\nPlease read through our new ToS then agree with the buttons below, or decline.\n\n> We update our ToS agreements regulary, which is why you are seeing this again, or you might just be new here.`)
            ],
            components: [agreementRow]
        });

        const agreementInteraction = await interaction.fetchReply();

        let filter = m => m.user.id === interaction.user.id;
        const collector = agreementInteraction.createMessageComponentCollector({
            filter,
            time: 1000 * 60
        });

        collector.on('collect', async (interactionCollector) => {
            if (interactionCollector.customId === "agree") {
                await interactionCollector.deferUpdate();

                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(851712)
                        .setTitle(`Successfully agreed to ToS`)
                        .setDescription(`Thank you for agreeing to our newly update Terms of Service, you may now continue using the bot features.`)
                    ],
                    components: [agreementRow]
                })

                if(tosAgreementRows.length === 0) {
                    await client.connection.query(`INSERT INTO tos_agreements (agreement_userid, agreement_date) VALUES (${interaction.user.id}, ${Date.now()})`);
                } else {
                    await client.connection.query(`UPDATE tos_agreements SET agreement_date = "${Date.now()}" WHERE agreement_userid = ${interaction.user.id}`);
                }
                return;
            }

            if (interactionCollector.customId === "disagree") {
                await interactionCollector.deferUpdate();

                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`Successfully disagreed to our ToS`)
                        .setDescription(`You have now declined agreement to our ToS, please note that no further bot access can be given unless you agree to the new Terms of Service.`)
                    ],
                    components: [agreementRow]
                });
                return;
            }
        });

        collector.on('end', async (collected) => {
            if(collected.size === 0) {
                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`Agreement has timed out`)
                        .setDescription(`Your agreement post has timed out, please reuse a command to get a new one up for display to agree to our newest TOS!`)
                    ],
                    components: [agreementRow]
                });
            }
        });
    }

    // Slash Command Handling
    if (interaction.isChatInputCommand()) {

        try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.UseExternalEmojis) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ReadMessageHistory)) {
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`:x: Missing Permissions :x:`)
                        .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                    ],
                    ephemeral: true,
                })
            }
        } catch (error) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                return;
            } else {
                if (error.rawError.message === "Cannot send messages to this user") {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: Failed to send message, please open your DMs before using this command again.'
                    })
                } else {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                    })
                }
            }
        }

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) {
            let embed = new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`:x: An error has occured, please contact the developer if this is a mistake.`)
            return interaction.reply({
                embeds: [embed],
                epehemeral: true
            });
        }

        if (cmd.DeveloperCommand && !interaction.user.id.includes(config.DEVELOPER_IDS)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:x: Missing Permissions :x:`)
                    .setDescription(`Looks like you do not have enough permissions to run this command, this command requires you to have the \`Developer\` permission to run.`)
                ],
            })
        }

        if (cmd.serverOwner && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:x: Missing Permissions :x:`)
                    .setDescription(`Looks like you do not have enough permissions to run this command, this command requires you to have the \`Server Owner\` permission to run.`)
                ],
            })
        }

        if (cmd.serverAdmin && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:x: Missing Permissions :x:`)
                    .setDescription(`Looks like you do not have enough permissions to run this command, this command requires you to have the \`Administrator\` permission to run.`)
                ],
            })
        }

        //INTERACTION BELOW
        const args = [];
        const con = client.connection;

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        if (!interaction.member.permissions.has(cmd.userPermissions || []))
            return interaction.reply({
                content: "You do not have permissions to use this command!",
            });

        await cmd.run(client, interaction, con, args);
        //INTERACTION ABOVE
    }

    // Context Menu Handling
    /*
    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({
            ephemeral: false
        });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
    */

    if (interaction.isButton()) {
        const {
            member,
            channel,
            message,
            user,
            guild
        } = interaction;

        //TRY TO USE COLLECTORS INSTEAD OF THIS! (WILL SURVIVE FOREVER)
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/