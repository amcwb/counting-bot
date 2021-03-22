import * as fs from "fs";
import * as path from "path";
import discord, { Client, Message } from "discord.js";
import { loadOptions } from "./options";
import { CustomClient, getCount, getCountChannel, getCounts } from "./client";

// Create client with commands property
const client: CustomClient = new Client();
client.config = loadOptions();
client.getCount = getCount.bind(client);
client.getCounts = getCounts.bind(client);
client.getCountChannel = getCountChannel.bind(client);
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
    client.getCounts(10).then(counts => {
        // Difference in all.
        const differences: number[] = [];
        for (let i = counts.length - 2; i >= 0; i--) {
            differences.push(counts[i+1].value-counts[i].value);
        }

        if (differences[0] !== 1) {
            message.delete().then(() => {
                message.reply("That number does not follow the previous number...").then(res => {
                    res.delete({timeout: 5000});
                })
            }).catch(() => {
                message.reply("That number does not follow the previous number... (I was unable to delete your message)")
                    .then(res => {
                        res.delete({timeout: 5000});
                    })
            })
        } else if (counts.length >= 2 && counts[counts.length-1].user === counts[counts.length-2].user) {
            // Same user
            message.delete().then(() => {
                message.reply("You can not follow yourself!").then(res => {
                    res.delete({timeout: 5000});
                })
            });
        }
    })
}

// Handle commands
client.on("message", (message) => {
    if (message.author.id === client.user.id) return;
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