const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'enable_autoroles',
    optionName: "Give roles on Join",
    optionDescription: "Give roles to a user upon joining the server.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({guild,user}) => {
        try {
            return await client.rolemodule.has(`${guild.id}`);
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
            await pool.query(`UPDATE guild_modules SET module_role = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.rolemodule.set(`${guild.id}`, "Autoroles Enabled!");
            } else {
                client.rolemodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}