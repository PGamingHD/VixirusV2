const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'private_msg',
    optionName: "Private Message",
    optionDescription: "Change the Private message",
    optionType: DBD.formTypes.textarea("Have a great time in **{server}**!", 1, 1024, false, true),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedPrivateMessages.get(`${guild.id}`);
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
            if (newData.length === 0) return {error: 'Please include text'};
            if (newData === "") newData = "Have a great time in **{server}**!";
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET data_private = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedPrivateMessages.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}