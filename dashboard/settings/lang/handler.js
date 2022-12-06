const {
    readdirSync
} = require("fs");

const langFiles = readdirSync("./dashboard/settings/lang/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'language',
    categoryName: "Language Module",
    categoryDescription: "Enable/Disable the language module and change your guild language.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
}