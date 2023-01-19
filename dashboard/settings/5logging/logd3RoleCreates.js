const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'enable_rolecreates',
    optionName: "Role Create",
    optionDescription: "Log created server roles.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.roleCreate.has(`${guild.id}`);
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
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_logs SET log_rolecreate = ${newData} WHERE log_ServerId = ${guild.id}`);

            if (newData) {
                client.roleCreate.set(`${guild.id}`, "Logging Enabled!");
            } else {
                client.roleCreate.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}