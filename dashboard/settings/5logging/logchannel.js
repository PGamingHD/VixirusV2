const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    ChannelType
} = require('discord.js');
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'logging_channel',
    optionName: "Logging Channel",
    optionDescription: "The channel that logs should be displayed in.",
    optionType: DBD.formTypes.channelsSelect(false, [ChannelType.GuildText], true, false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.cachedLoggingChannels.get(`${guild.id}`);
        } catch (error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({
        guild,
        newData
    }) => {
        try {
            const pool = await getPool().getConnection();

            await guildHasData(guild, pool);
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            if (newData === "") newData = "0";
            await pool.query(`UPDATE guild_data SET data_logchannel = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedLoggingChannels.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}