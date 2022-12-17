const {
    readdirSync
} = require("fs");

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
}