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
    PermissionFlagsBits,
    Permissions
} = require("discord.js");
const client = require("../../index.js");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
const config = require("../../botconfig/config.json");
const embed = require("../../botconfig/embed.json");
const prettyMilliseconds = require("pretty-ms")
const {
    maintenanceMode,
    latestTOS,
    agreementDates,
    blacklistedUsers,
    blacklistedGuilds,
    startupCooldown
} = require("../../index");
const {
    languageControl,
    stringTemplateParser,
} = require("../../handler/functions");
const getPool = require("../../handler/database");

client.on("interactionCreate", async (interaction) => {
    if (!interaction.guild) return;

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
                if (error.message === "Cannot send messages to this user") {
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

        if (cmd.module === "mod") {
            let hasAccess = false;
            const guildModRoles = await client.cachedModRoles.get(`${interaction.guild.id}`);
            const getModuleStatus = await client.modmodule.has(`${interaction.guild.id}`);

            if (!getModuleStatus) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Module Disabled :x:`)
                        .setDescription(`***Woops, it seems like this module is not yet enabled, please enable it and try again.***`)
                    ],
                    ephemeral: true
                })
            }

            if (interaction.guild.ownerId === interaction.user.id) hasAccess = true;

            await guildModRoles.forEach(role => {
                if (interaction.member.roles.cache.has(role)) hasAccess = true;
            });

            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) hasAccess = true;

            if (!hasAccess) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.errorColor)
                        .setTitle(`:x: Missing Permissions :x:`)
                        .setDescription(`***It seems like you do not have the required Moderation Role or Administrator Permission to execute this command.***`)
                    ],
                    ephemeral: true
                })
            }
        }

        if (client.userCooldown.has(`${interaction.user.id}`)) {
            const usercd = await client.userCooldown.get(`${interaction.user.id}`);
            let prettified = prettyMilliseconds(usercd - Date.now(), {
                verbose: true
            });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setDescription(stringTemplateParser(await languageControl(interaction.guild, 'ON_COOLDOWN'), {
                        timeLeft: prettified
                    }))
                ],
                ephemeral: true
            })
        }

        if (cmd?.cooldown) {
            let expireDate = Date.now() + 1000 * cmd?.cooldown;
            await client.userCooldown.set(`${interaction.user.id}`, expireDate);

            setTimeout(async () => {
                await client.userCooldown.delete(`${interaction.user.id}`);
            }, 1000 * cmd?.cooldown);
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
        const con = await getPool().getConnection();

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        if (!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.reply({
            content: await languageControl(interaction.guild, 'MISSING_CMD_PERMS'),
        });

        try {
            await cmd.run(client, interaction, con, args);
            await con.release();
        } catch (error) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setFooter({
                        text: 'Please report the error message above to the Bot Developer!'
                    })
                    .setTitle(`:x: Something went wrong while running the \`${cmd.name}\` command!`)
                    .setDescription(`\`\`\`${error.message}\`\`\``)
                ],
                ephemeral: true
            })
        }
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