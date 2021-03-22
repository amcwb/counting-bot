import { Message, TextChannel } from "discord.js";
import { CustomClient } from "../client";

export const name = "set-count";
export const description = "Set the current count value";
export const admin = true;
export function run(client: CustomClient, message: Message, args: string[]) {
    let value: number;
    if (args.length > 0) {
        value = parseInt(args[0], 10);
        if (isNaN(value)) {
            return message.reply("First argument was not a number")
        }
    } else {
        return message.reply("No arguments found. Requires number")
    }

    client.getCountChannel().then((channel: TextChannel) => {
        channel.send(`${value} To reset channel count`).then((res) => {
            message.reply(`Reset the channel count successfully -> ${res.url}`);
        });
    });
}