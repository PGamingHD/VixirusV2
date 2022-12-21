const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'mod_slowmode',
    optionName: "Slowmode Command",
    optionDescription: "Enable the slowmode command to be used by Moderators.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({
        guild,
        user
    }) => {
        try {
            return await client.slowmodeCmd.has(`${guild.id}`);
        } catch (error) {
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
            await pool.query(`UPDATE guild_commands SET command_slowmode = ${newData} WHERE command_ServerId = ${guild.id}`);

            if (newData) {
                client.slowmodeCmd.set(`${guild.id}`, "SlowmodeCMD Enabled!");
            } else {
                client.slowmodeCmd.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}