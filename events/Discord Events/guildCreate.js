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
    confirmGuildData
} = require("../../handler/functions");
const getPool = require("../../handler/database");

client.on("guildCreate", async (guild, Client) => {

    const pool = await getPool().getConnection();
    const [isAvailable, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);

    if (isAvailable.length === 0) {
        await pool.query(`INSERT INTO guild_data(guild_id,guild_language) VALUES("${guild.id}","en")`);

        //STARTER VALUES THAT MUST BE RE-SET!
        await client.cachedGuildLanguages.set(`${guild.id}`, "en");
        await client.cachedServerPrefixes.set(`${guild.id}`, "v!");
        await client.cachedWelcomeMessages.set(`${guild.id}`, "Hey {user}, welcome to **{server}**!");
        await client.cachedWelcomeChannels.set(`${guild.id}`, null);
        await client.cachedLeaveMessages.set(`${guild.id}`, "{user} just left the server!");
        await client.cachedLeaveChannels.set(`${guild.id}`, null);
        await client.cachedPrivateMessages.set(`${guild.id}`, "Have a great time in **{server}**!");
    }

    try {
        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks));

        if (!ch) return;

        return ch.send({
            content: await languageControl(guild, 'WELCOME_MSG')
        })
    } catch (error) {
        console.log(error)
    }

    await pool.release();
});