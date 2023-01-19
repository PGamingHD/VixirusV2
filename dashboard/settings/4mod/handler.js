const {
    readdirSync
} = require("fs");
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

const langFiles = readdirSync("./dashboard/settings/4mod/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'mod',
    categoryName: "Moderation Module",
    categoryDescription: "Enable/Disable the moderation module and set moderators to use moderation commands.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
    toggleable: true,
    getActualSet: async ({guild}) => {
        try {
            return await client.modmodule.has(`${guild.id}`);
        } catch(error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({guild, newData}) => {
        const pool = await getPool().getConnection();

        await guildHasData(guild, pool);
        
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_modules SET module_mod = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.modmodule.set(`${guild.id}`, "Mod Enabled!");
            } else {
                client.modmodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}