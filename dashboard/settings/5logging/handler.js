const {
    readdirSync
} = require("fs");

const langFiles = readdirSync("./dashboard/settings/5logging/");

const fileArray = [];
langFiles.forEach(file => {
    if (file === "handler.js") return;

    const dashboardItem = require("./" + file);
    fileArray.push(dashboardItem);
});

module.exports = {
    categoryId: 'logging',
    categoryName: "Logging Module",
    categoryDescription: "Enable/Disable the logging module and log most server events.",
    categoryImageURL: "https://cdn.discordapp.com/attachments/1010999257899204769/1049750491967520798/onlyV.png",
    categoryOptionsList: fileArray,
}