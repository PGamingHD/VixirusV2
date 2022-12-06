const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'enable_private',
    optionName: "Private Message on Join",
    optionDescription: "Send a message to user PMs whenever a user decides to join the server.",
    optionType: DBD.formTypes.switch(false),
    getActualSet: async ({guild,user}) => {
        try {
            return await client.privatemodule.has(`${guild.id}`);
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
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE guild_id = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET guild_privatemodule = ${newData} WHERE guild_id = ${guild.id}`);

            if (newData) {
                client.privatemodule.set(`${guild.id}`, "Welcome Enabled!");
            } else {
                client.privatemodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}