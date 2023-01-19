const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'lang',
    optionName: "Language",
    optionDescription: "Change the bots guild language",
    optionType: DBD.formTypes.select({
        "English": 'en',
        "Swedish": 'sv',
    }),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedGuildLanguages.get(`${guild.id}`);
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
            await pool.query(`UPDATE guild_data SET data_language = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedGuildLanguages.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}