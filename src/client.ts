import discord, { Client, GuildMember, TextChannel } from "discord.js";
import { Configuration } from "./options";
import { Command } from "./commands/commands";

// Expanding client for custom features
export type CustomClient = Partial<Client> & {
    commands?: discord.Collection<string, Command>,
    config?: Partial<Configuration>,
    getCount?: () => Promise<Count>,
    getCounts?: (limit: number) => Promise<Count[]>,
    getCountChannel?: () => Promise<TextChannel>
};

export interface Count {
    user: GuildMember,
    value: number
}


export function getCountFromContent(content: string): number {
    const value = parseInt(content.split(/ +/)[0], 10);
    if (isNaN(value)) {
        throw TypeError;
    }
    return value;
}

export function getCounts(limit: number): Promise<Count[]> {
    return new Promise((resolve, reject) => {
        this.getCountChannel().then((channel: TextChannel) => {
            let counts: Count[] = [];
            channel.messages.fetch({ limit }).then(messages => {
                // Find first message that contains a number.
                // This is only done in the case the bot messages take up space!
                const lastMessages = messages.filter(message => {
                    return message.content.match(/^\d/) ? true : false;
                });

                for (const lastMessage of lastMessages.array().reverse()) {
                    try {
                        // Reset if bot. This is because the bot overrides others.
                        if (lastMessage.member.id === lastMessage.client.user.id) {
                            counts = [];
                        }
                        const value = getCountFromContent(lastMessage.content);
                        counts.push({ user: lastMessage.member, value });
                    } catch (error) {
                        console.log(error);
                        // Ignore bad number
                    }
                }
                resolve(counts);
            }).catch(reject);
        });
    });
}

export function getCount(): Promise<Count> {
    return new Promise((resolve, reject) => {
        this.getCountChannel().then((channel: TextChannel) => {
            channel.messages.fetch({ limit: 4 }).then(messages => {
                // Find first message that contains a number.
                // This is only done in the case the bot messages take up space!
                const lastMessage = messages.filter(message => {
                    return message.content.match(/^\d/) ? true : false;
                }).first();
                try {
                    const value = getCountFromContent(lastMessage.content);
                    resolve({ user: lastMessage.member, value });
                } catch (error) {
                    reject(error);
                }
            }).catch(reject);
        });
    });
}

export function getCountChannel(): Promise<TextChannel> {
    return this.channels.fetch(this.config.countChannelID);
}