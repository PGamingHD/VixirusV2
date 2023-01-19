const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
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
        try {
            return await client.cachedServerPrefixes.get(`${guild.id}`);
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
            if (newData.length === 0) return {error: 'Invalid length, please have a prefix!'};
            if (newData === "") newData = "v!";
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET data_prefix = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedServerPrefixes.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}