const DBD = require('discord-dashboard');
const { ChannelType } = require('discord.js');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'leave_channel',
    optionName: "Leave Channel",
    optionDescription: "Change the Leave channel",
    optionType: DBD.formTypes.channelsSelect(false, [ChannelType.GuildText], true, false),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedLeaveChannels.get(`${guild.id}`)
        } catch(error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({
        guild,
        newData
    }) => {
        const pool = await getPool().getConnection();

        await guildHasData(guild, pool);
        
        try {
            if (newData.length === 0) return {error: 'Invalid channel'};
            if (newData === "") newData = "0";
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET data_byechannel = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedLeaveChannels.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}