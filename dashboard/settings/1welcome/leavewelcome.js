const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'leave_msg',
    optionName: "Leave Message",
    optionDescription: "Change the Leave message",
    optionType: DBD.formTypes.textarea("**{user}** just left the server!", 1, 1024, false, true),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedLeaveMessages.get(`${guild.id}`);
        } catch(error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({
        guild,
        newData
    }) => {
        if (newData === "") return;
        
        const pool = await getPool().getConnection();
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            if (newData === "") newData = "**{user}** just left the server!";
            await pool.query(`UPDATE guild_data SET data_bye = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedLeaveMessages.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}