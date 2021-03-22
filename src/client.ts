import discord, { Client, TextChannel } from "discord.js";
import { Configuration } from "./options";
import { Command } from "./commands/commands";

// Expanding client for custom features
export type CustomClient = Partial<Client> & {
    commands?: discord.Collection<string, Command>,
    config?: Partial<Configuration>,
    getCount?: () => Promise<number>
};


export function getCount(): Promise<number> {
    return new Promise((resolve, reject) => {
        this.channels.fetch(this.config.countChannelID).then((channel: TextChannel) => {
            channel.messages.fetch({ limit: 1 }).then(messages => {
                const lastMessage = messages.first();
                try {
                    const value = parseInt(lastMessage.content, 10);
                    if (isNaN(value)) {
                        resolve(0);
                    }
                    resolve(value);
                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        })
    });
}