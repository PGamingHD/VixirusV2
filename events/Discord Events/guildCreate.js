const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const client = require("../../index.js");
const {
    languageControl,
    guildHasData
} = require("../../handler/functions");
const getPool = require("../../handler/database");

client.on("guildCreate", async (guild) => {

    client.logger.log("I just joined a guild called " + guild.name + " (" +  guild.id + ")", "guildjoin");

    const pool = await getPool().getConnection();

    await guildHasData(guild, pool);

    try {
        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages));

        if (!ch) return;

        return await ch.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.hidden)
                .setThumbnail('https://cdn.discordapp.com/attachments/1063980215505788958/1063980431931883560/ad2e4d6e7b90ca6005a5038e22b099cc.png')
                .setDescription(`🛡️ ***Server Protected by VixirusV2*** 🛡️\n\n\`• How is your server protected?\`\n*- With our system, if an earlier punished user joins your server you will be alerted with the reason and can from there decide to punish the user in your own server aswell.*\n\n\`• Is this system really reliable?\`\n*- Not only is this system armed with a strong logging system, the system is also a very good defense against known raiders / known rule breakers!*\n\n\`• Is this system configurable?\`\n*- This system has large configurability, configure the system to your own liking through our [dashboard](${config.Discord_Dashboard.Dashboard_domain})!*\n\n\`• Are we allowed to suggest new features?\`\n*- Yes, we really appreciate new suggestions so that we can improve the product. Please join our support server and suggest new features all you want! :)*\n\n\`• Where can I get support for this product?\`\n*- The support server can be found [here](${config.Discord_Links.Support_Server}), don't hesitate to join and ask questions.*\n\n🛡️ ***Server Protected by VixirusV2*** 🛡️`)
                .setFooter({text: 'by PG Technologies™'})
                .setTimestamp()
            ]
        });
    } catch {}

    await pool.release();
});