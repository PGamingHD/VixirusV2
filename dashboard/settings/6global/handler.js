const {
    readdirSync
} = require("fs");
const getPool = require("../../../handler/database");
const {
    writeError,
    guildHasData
} = require("../../../handler/functions");
const client = require("../../../index");

const langFiles = readdirSync("./dashboard/settings/6global/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'global',
    categoryName: "Global Module",
    categoryDescription: "The global module is a module that allows you to have a global chat with all bot members on your own server.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
    toggleable: true,
    getActualSet: async ({
        guild
    }) => {
        try {
            return await client.globalmodule.has(`${guild.id}`);
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
            await pool.query(`UPDATE guild_modules SET module_global = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.globalmodule.set(`${guild.id}`, "Global Enabled!");
            } else {
                client.globalmodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}