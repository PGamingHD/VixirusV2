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
const {
    languageControl,
    stringTemplateParser
} = require("../handler/functions");

client.on("interactionCreate", async (interaction) => {

    if (startupCooldown.has("startupcooldown") && !config.DEVELOPER_IDS.includes(interaction.user.id)) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setDescription(await languageControl(interaction.guild, 'STARTUP_WARNING'))
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
                .setDescription(await languageControl(interaction.guild, 'MAINTENANCE_ON'))
            ]
        })
    }

    const [blacklistGuildRows, blacklistGuildFields] = await client.connection.query(`SELECT * FROM blacklist_data WHERE blacklist_type = "GUILD" AND blacklist_id = "${interaction.guild.id}"`);
    if (blacklistGuildRows.length !== 0) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setTitle(await languageControl(interaction.guild, 'DETECTED_BLACKLIST'))
                .setDescription(await languageControl(interaction.guild, 'BLACKLISTED_GUILD'))
            ]
        })
    }

    const [blacklistUserRows, blacklistUserFields] = await client.connection.query(`SELECT * FROM blacklist_data WHERE blacklist_type = "USER" AND blacklist_id = "${interaction.user.id}"`);
    if (blacklistUserRows.length !== 0) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(embed.errorColor)
                .setTitle(await languageControl(interaction.guild, 'DETECTED_BLACKLIST'))
                .setDescription(await languageControl(interaction.guild, 'BLACKLISTED_USER'))
            ]
        })
    }

    const [tosAgreementRows, tosAgreementFields] = await client.connection.query(`SELECT * FROM tos_agreements WHERE agreement_userid = ${interaction.user.id}`);

    let existingAgreement = 0;

    if (tosAgreementRows.length !== 0) {
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

        const main = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(await languageControl(interaction.guild, 'TOS_UPDATED_TITLE'))
                .setDescription(stringTemplateParser(await languageControl(interaction.guild, 'TOS_UPDATED_DESC'), {
                    interactionUser: interaction.user
                }))
            ],
            components: [agreementRow]
        });

        let filter = m => m.user.id === interaction.user.id;
        const collector = main.createMessageComponentCollector({
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
                        .setTitle(await languageControl(interaction.guild, 'TOS_AGREEMENT_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'TOS_AGREEMENT_DESC'))
                    ],
                    components: [agreementRow]
                })

                if (tosAgreementRows.length === 0) {
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
                        .setTitle(await languageControl(interaction.guild, 'TOS_DECLINE_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'TOS_DECLINE_DESC'))
                    ],
                    components: [agreementRow]
                });
                return;
            }
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(await languageControl(interaction.guild, 'TOS_TIMEOUT_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'TOS_TIMEOUT_DESC'))
                    ],
                    components: [agreementRow]
                });
            }
        });
        return;
    }

    // Slash Command Handling
    if (interaction.isChatInputCommand()) {

        try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.UseExternalEmojis) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ReadMessageHistory)) {
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(await languageControl(interaction.guild, 'MISSING_PERMS_TITLE'))
                        .setDescription(await languageControl(interaction.guild, 'MISSING_PERMS_DESC'))
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
                        embeds: [
                            new EmbedBuilder()
                            .setColor(embed.errorColor)
                            .setDescription(await languageControl(interaction.guild, 'FAILED_TO_SEND_MSG'))
                        ],
                        components: [],
                    })
                } else {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(embed.errorColor)
                            .setDescription(await languageControl(interaction.guild, 'RAN_INTO_DM_ERROR'))
                        ],
                        components: [],
                    })
                }
            }
        }

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) {
            let embed = new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(await languageControl(interaction.guild, 'COMMAND_ERROR'))
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
                    .setTitle(await languageControl(interaction.guild, 'MISSING_PERMS_TITLE'))
                    .setDescription(await languageControl(interaction.guild, 'MISSING_DEV_PERMS'))
                ],
            })
        }

        if (cmd.serverOwner && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(await languageControl(interaction.guild, 'MISSING_PERMS_TITLE'))
                    .setDescription(await languageControl(interaction.guild, 'MISSING_OWNER_PERMS'))
                ],
            })
        }

        if (cmd.serverAdmin && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(await languageControl(interaction.guild, 'MISSING_PERMS_TITLE'))
                    .setDescription(await languageControl(interaction.guild, 'MISSING_ADMIN_PERMS'))
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
                content: await languageControl(interaction.guild, 'MISSING_CMD_PERMS'),
            });

        await cmd.run(client, interaction, con, args);
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