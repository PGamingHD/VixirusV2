const client = require("../../index");
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
const config = require("../../botconfig/config.json");
const startupCooldown = client.startupCooldown;
const prettyMilliseconds = require("pretty-ms")
const {
    escapeRegex,
    languageControl,
    stringTemplateParser,
    globalChat
} = require("../../handler/functions");
const getPool = require("../../handler/database");
const chalk = require("chalk");

client.on("messageCreate", async (message) => {
    client.messagesSent++;
    
    if (!message.guild) return;
    if (message.author.bot) return;

    if (await client.usersAFK.has(`${message.author.id}`)) {
        await client.usersAFK.delete(`${message.author.id}`);

        await message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`:x: You are no longer marked as AFK`)
            ]
        });
    }

    if (message.mentions.users.first()) {
        if (await client.usersAFK.has(`${message.mentions.users.first().id}`)) await message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenanceColor)
                .setDescription(`:warning: That user is currently marked as AFK for the following reason: \`\`\`${await client.usersAFK.get(`${message.mentions.users.first().id}`)}\`\`\``)
            ]
        })
    }

    //GLOBAL CHAT
    await globalChat(message);
    //GLOBAL CHAT

    if (!client.prefixmodule.has(`${message.guild.id}`)) return;

    const prefix = client.cachedServerPrefixes.get(`${message.guild.id}`);
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
    if (!prefixRegex.test(message.content)) return;
    const [, mPrefix] = message.content.match(prefixRegex);

    if (!message.content.toLowerCase().startsWith(mPrefix)) return;

    const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
    const cmd = args.length > 0 ? args.shift().toLowerCase() : null;

    if (!cmd || cmd.length == 0) {
        if (mPrefix.includes(client.user.id)) {
            const buttonrow = new ActionRowBuilder()
            buttonrow.addComponents([
                new ButtonBuilder()
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=1003056966706413689&permissions=517543939136&scope=bot%20applications.commands`)
                .setLabel('Invite Me')
                .setStyle(ButtonStyle.Link)
            ])
            buttonrow.addComponents([
                new ButtonBuilder()
                .setURL(`https://www.discord.gg/pxySje4GPC`)
                .setLabel(`Support Server`)
                .setStyle(ButtonStyle.Link)
            ])
            message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setAuthor({
                        name: 'Looks like I was pinged? Let me help you a bit!',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`>>> My current guild prefix is: \`${prefix}\` and \`/\`\n\nTo view all commands please use: \`${prefix}help\` or \`/help\``)
                    .setFooter({
                        text: `Requested by: ${message.author.tag}`
                    })
                    .setTimestamp()
                ],
                components: [buttonrow]
            })
        }
        return;
    }

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    if (client.globalCooldown.has(`${command?.name}`)) {
        const usercd = await client.globalCooldown.get(`${command.name}`);
        let prettified = prettyMilliseconds(usercd - Date.now(), {
            verbose: true
        });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setDescription(stringTemplateParser(await languageControl(message.guild, 'ON_COOLDOWN'), {
                    timeLeft: prettified
                }))
            ],
            ephemeral: true
        })
    }

    if (client.userCooldown.has(`${message.author.id}`)) {
        const usercd = await client.userCooldown.get(`${message.author.id}`);
        let prettified = prettyMilliseconds(usercd - Date.now(), {
            verbose: true
        });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setDescription(stringTemplateParser(await languageControl(message.guild, 'ON_COOLDOWN'), {
                    timeLeft: prettified
                }))
            ],
            ephemeral: true
        })
    }

    if (command?.cooldown) {
        let expireDate = Date.now() + 1000 * command?.cooldown;
        await client.userCooldown.set(`${command?.name}`, expireDate);

        setTimeout(async () => {
            await client.userCooldown.delete(`${command?.name}`);
        }, 1000 * command?.cooldown);
    }

    if (command?.globalCooldown) {
        let expireDate = Date.now() + 1000 * command?.globalCooldown;
        await client.globalCooldown.set(`${command?.name}`, expireDate);

        setTimeout(async () => {
            await client.globalCooldown.delete(`${command?.name}`);
        }, 1000 * command?.globalCooldown);
    }

    let clientArray = [];
    command.clientPerms.map(permission => {
        if (!message.guild.members.me.permissions.has(permission)) {
            const topush = permission.split(/(?=[A-Z])/).join(" ");
            clientArray.push(topush)
        }
    });
    
    if (clientArray.length !== 0) {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setTitle(await languageControl(message.guild, 'MISSING_PERMS_TITLE'))
                .setDescription(stringTemplateParser(await languageControl(message.guild, 'MISSING_CLIENT_PERMS'), {
                    requiredCPerms: clientArray.join('\`, \`')
                }))
            ]
        })
    }

    let userArray = [];
    command.userPerms.map(permission => {
        if (!message.member.permissions.has(permission)) {
            const topush = permission.split(/(?=[A-Z])/).join(" ");
            userArray.push(topush)
        }
    });

    if (userArray.length !== 0) {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setTitle(await languageControl(message.guild, 'MISSING_PERMS_TITLE'))
                .setDescription(stringTemplateParser(await languageControl(message.guild, 'MISSING_USER_PERMS'), {
                    requiredUPerms: userArray.join('\`, \`')
                }))
            ]
        })
    }

    try {
        const con = await getPool().getConnection();;
        await command.run(client, message, args, con, prefix);
    } catch (error) {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.errorColor)
                .setFooter({
                    text: 'Please report the error message above to the Bot Developer!'
                })
                .setTitle(`:x: Something went wrong while running the \`${command.name}\` command!`)
                .setDescription(`\`\`\`${error.message}\`\`\``)
            ]
        })
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/