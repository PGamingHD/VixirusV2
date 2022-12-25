const {
    readdirSync
} = require("fs");
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

const prefixFiles = readdirSync("./dashboard/settings/2prefix/");

const fileArray = [];
prefixFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'prefix',
    categoryName: "Prefix Module",
    categoryDescription: "Enable/Disable the prefix module and allow for commands to be executed with specific prefixes.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
    toggleable: true,
    getActualSet: async ({guild}) => {
        try {
            return await client.prefixmodule.has(`${guild.id}`);
        } catch(error) {
            return writeError(error, guild);
        }
    },
    setNew: async ({guild, newData}) => {
        const pool = await getPool().getConnection();
        try {
            const [guildData, guildRows] = await pool.query(`SELECT * FROM guild_data WHERE data_ServerId = ${guild.id}`);
            if (guildData.length === 0) return;
            await pool.query(`UPDATE guild_modules SET module_prefix = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.prefixmodule.set(`${guild.id}`, "Prefix Enabled!");
            } else {
                client.prefixmodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}