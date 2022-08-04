const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const emoji = require("../botconfig/emojis.json")
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const client = require("../index");
const {
    languageControl
} = require("../handler/functions");

client.on("guildCreate", async (guild, Client) => {
    try {
        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks));

        if (!ch) return;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
            try {
                const owner = await client.users.fetch(`${guild.ownerId}`);

                await owner.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(await languageControl(guild, 'NO_ADMIN_PERMS'))
                        .setDescription(await languageControl(guild, 'NO_ADMIN_PERMS_OWNERDM'))
                    ]
                })

                return ch.send({
                    content: await languageControl(guild, 'WELCOME_MSG')
                })
            } catch (error) {
                if (ch && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks) && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
                    await ch.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setTitle(await languageControl(guild, 'NO_ADMIN_PERMS'))
                            .setDescription(await languageControl(guild, 'OWNED_DISABLED_DMS_ONINV'))
                        ]
                    })
                    return ch.send({
                        content: await languageControl(guild, 'WELCOME_MSG')
                    })
                } else {
                    return;
                }
            }
        } else {
            return ch.send({
                content: await languageControl(guild, 'WELCOME_MSG')
            })
        }
    } catch (error) {
        console.log(error)
    }
});