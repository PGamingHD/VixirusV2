const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'mod_lockdown',
    optionName: "Lockdown Command",
    optionDescription: "Enable the Lockdown command to be used by Moderators.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.kickCmd.has(`${guild.id}`);
        } catch (error) {
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
            await pool.query(`UPDATE guild_commands SET command_lockdown = ${newData} WHERE command_ServerId = ${guild.id}`);

            if (newData) {
                client.lockdownCmd.set(`${guild.id}`, "LockdownCMD Enabled!");
            } else {
                client.lockdownCmd.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}