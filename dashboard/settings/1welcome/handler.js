const {
    readdirSync
} = require("fs");
const DBD = require('discord-dashboard');
const getPool = require("../../../handler/database");
const {
    writeError
} = require("../../../handler/functions");
const client = require("../../../index");

const welcomeFiles = readdirSync("./dashboard/settings/1welcome/");

const fileArray = [];
welcomeFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'welcome',
    categoryName: "Welcome Module",
    categoryDescription: "Enable/Disable the welcome module and give all your new guild members a lil' welcome.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
    toggleable: true,
    getActualSet: async ({guild}) => {
        try {
            return await client.welcomemodule.has(`${guild.id}`);
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
            await pool.query(`UPDATE guild_modules SET module_welcome = ${newData} WHERE module_ServerId = ${guild.id}`);

            if (newData) {
                client.welcomemodule.set(`${guild.id}`, "Welcome Enabled!");
            } else {
                client.welcomemodule.delete(`${guild.id}`);
            }

            return await pool.release();
        } catch (error) {
            await pool.release();
            return writeError(error, guild);
        }
    }
}