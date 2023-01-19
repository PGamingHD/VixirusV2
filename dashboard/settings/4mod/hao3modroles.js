const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'mod_roles',
    optionName: "Moderation Roles",
    optionDescription: "Change the Moderation Roles, these roles will be able to execute ALL Moderation Commands.",
    optionType: DBD.formTypes.rolesMultiSelect(false, true, false),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedModRoles.get(`${guild.id}`);
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
            if (newData.length === 0) return {error: 'You may not return no roles'};
            if (newData.includes(guild.object.roles.everyone.id)) return {error: 'You may not include the everyone role in this!'};
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            let roles = "'" + newData.join("','") + "'";
            if (newData[0] === "" || newData[0] === undefined) return {error: 'No roles were found, please select roles first'};
            await pool.query(`UPDATE guild_data SET data_modroles = JSON_ARRAY(${roles}) WHERE data_ServerId = ${guild.id}`);

            await client.cachedModRoles.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}