const {
    readdirSync
} = require("fs");

const prefixFiles = readdirSync("./dashboard/settings/prefix/");

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
}