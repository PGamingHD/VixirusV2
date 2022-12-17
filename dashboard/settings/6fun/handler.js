const {
    readdirSync
} = require("fs");

const langFiles = readdirSync("./dashboard/settings/6fun/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'fun',
    categoryName: "Fun Module",
    categoryDescription: "Enable/Disable the fun module and allow your members to enjoy the fun part of this bot.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
}