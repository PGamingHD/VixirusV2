const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'prefix',
    optionName: "Prefix Module",
    optionDescription: "Change the Prefix",
    optionType: DBD.formTypes.input("v!", 1, 5, false, true),
    getActualSet: async ({
        guild,user
    }) => {
        const pool = await getPool().getConnection();
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);
            await pool.release();
            if (guildData.length === 0) return;
    
            return guildData[0].guild_prefix;
        } catch(error) {
            await pool.release();
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
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET guild_prefix = '${newData}' WHERE guild_id = ${guild.id}`);

            await client.cachedServerPrefixes.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}