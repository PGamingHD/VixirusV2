const {
    glob
} = require("glob");
const {
    promisify
} = require("util");
const {
    Client
} = require("discord.js");

const globPromise = promisify(glob);
const chalk = require("chalk");

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = {
                directory,
                ...file
            };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/**/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/**/*.js`);

    const arrayOfInteractions = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.interactionCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfInteractions.push(file);
    });

    const contextFiles = await globPromise(`${process.cwd()}/ContextCommands/**/*.js`);
    contextFiles.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        if (!file?.type) return;

        client.interactionCommands.set(file.name, file);
        arrayOfInteractions.push(file);
    });

    client.on("ready", async () => {
        await client.application.commands.set(arrayOfInteractions).then(client.logger.log("Successfully loaded all interaction commands globally", "ready"));
    });
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/