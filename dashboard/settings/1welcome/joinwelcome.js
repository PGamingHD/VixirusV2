const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

module.exports = {
    optionId: 'welcome',
    optionName: "Welcome Message",
    optionDescription: "Change the Welcome message, variables can be used! {user}, {username}, {server}, {serverid}, {servericon}, {serverowner}, {verificationlevel}, {membercount}!",
    optionType: DBD.formTypes.textarea("Hey {user}, welcome to **{server}**!", 1, 1024, false, true),
    getActualSet: async ({
        guild,user
    }) => {
        try {
            return await client.cachedWelcomeMessages.get(`${guild.id}`);
        } catch(error) {
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
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_data SET data_welcome = '${newData}' WHERE data_ServerId = ${guild.id}`);

            await client.cachedWelcomeMessages.set(`${guild.id}`, newData);

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}