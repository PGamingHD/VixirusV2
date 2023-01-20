const DBD = require('discord-dashboard');
const { ChannelType } = require('discord.js');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'global_channel',
    optionName: "Global Channel",
    optionDescription: "The channel that will be used as a global channel, make sure the client has access to send messages in there.",
    optionType: DBD.formTypes.channelsSelect(false, [ChannelType.GuildText], true, false),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.serverGlobal.get(`${guild.id}`);
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
            if (newData.length === 0) return {error: 'You may not return no channels'};
            if (newData[0] === "" || newData[0] === undefined) return {error: 'No channels were found, please select a channel first'};
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET data_globalchannel = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.serverGlobal.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}