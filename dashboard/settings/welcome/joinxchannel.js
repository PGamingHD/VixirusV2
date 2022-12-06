const DBD = require('discord-dashboard');
const { ChannelType } = require('discord.js');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'channel',
    optionName: "Welcome Channel",
    optionDescription: "Change the Welcome channel",
    optionType: DBD.formTypes.channelsSelect(false, [ChannelType.GuildText], true, false),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedWelcomeChannels.get(`${guild.id}`)
        } catch(error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({
        guild,
        newData
    }) => {
        const pool = await getPool().getConnection();
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET guild_welcomechannel = '${newData}' WHERE guild_id = ${guild.id}`);

            await client.cachedWelcomeChannels.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}