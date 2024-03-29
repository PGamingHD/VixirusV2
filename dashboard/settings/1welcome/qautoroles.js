const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'auto_roles',
    optionName: "Automatic Roles",
    optionDescription: "Change the Automaticly Given Roles",
    optionType: DBD.formTypes.rolesMultiSelect(false, true, false),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedAutoRoles.get(`${guild.id}`);
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
            if (newData[0] === "" || newData[0] === undefined || newData.includes(guild.object.roles.everyone.id)) return {error: 'Please include atleast 1 valid role & not the everyone role'};
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            let roles = "'" + newData.join("','") + "'";
            await pool.query(`UPDATE guild_data SET data_autoroles = JSON_ARRAY(${roles}) WHERE data_ServerId = ${guild.id}`);

            await client.cachedAutoRoles.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}