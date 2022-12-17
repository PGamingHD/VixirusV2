const {
    readdirSync
} = require("fs");

const langFiles = readdirSync("./dashboard/settings/5slowmode/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'slowmode',
    categoryName: "Slowmode Module",
    categoryDescription: "Enable/Disable the slowmode module and allow your moderators to switch on/off channel slowmodes.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
}