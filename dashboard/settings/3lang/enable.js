const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'enable_lang',
    optionName: "Language Module",
    optionDescription: "Enable/Disable the module.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.languagemodule.has(`${guild.id}`);
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
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_modules SET module_language = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.languagemodule.set(`${guild.id}`, "Language Enabled!");
            } else {
                client.languagemodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}