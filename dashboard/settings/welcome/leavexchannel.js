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
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET guild_byechannel = '${newData}' WHERE guild_id = ${guild.id}`);

            await client.cachedLeaveChannels.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}