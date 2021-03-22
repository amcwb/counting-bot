import { Message } from "discord.js";
import { CustomClient } from "../client";

export const name = "count";
export const description = "Get the current count value";
export const admin = false;
export function run(client: CustomClient, message: Message, args: string[]) {
    client.getCount().then((count) => {
        message.reply(`The current value is ${count.value}`);
    })
}