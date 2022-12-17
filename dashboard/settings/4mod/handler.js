const {
    readdirSync
} = require("fs");

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
}