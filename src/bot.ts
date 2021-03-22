import * as fs from "fs";
import * as path from "path";
import discord, { Client, Message } from "discord.js";
import { Command } from "./commands/commands";
import { loadOptions } from "./options";
import { CustomClient, getCount } from "./client";

// Create client with commands property
const client: CustomClient = new Client();
client.config = loadOptions();
client.getCount = getCount.bind(client);
client.commands = new discord.Collection();


// Load commands dynamically
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js") && file !== "commands.js");
for (const file of commandFiles) {
    import(`./commands/${file}`).then(command => {
        client.commands.set(command.name, command);
    }).catch(console.error);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
})


function handleCommand(message: Message) {
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)) {
        if (client.config.errorOnCommandNotFound) {
            message.reply("That command was not found!");
        }
        return;
    };

    try {
        const command = client.commands.get(commandName)
        if (command.admin) {
            // Ensure the user is authorised.
            const sharedRoles = client.config.adminRolesIDs.filter((roleID) => {
                return message.member.roles.cache.has(roleID);
            })

            if (sharedRoles.length === 0) {
                return message.reply("You must be an administrator to do this!");
            }
        }
        command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply("The command encountered an error. Contact the bot owner to report it.");
    }
}

function handleCount(message: Message) {
    return
}

// Handle commands
client.on("message", (message) => {
    if (message.content.startsWith(client.config.prefix) && !message.author.bot) {
        handleCommand(message);
    } else if (message.channel.id === client.config.countChannelID) {
        handleCount(message);
    }
})


// Start up
if (client.config.token === undefined) {
    console.error("No bot token provided in config.json!");
} else {
    client.login(client.config.token);
}