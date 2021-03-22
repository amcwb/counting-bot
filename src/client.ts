// Copyright (C) 2021 Avery
// 
// This file is part of counting-bot.
// 
// counting-bot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// counting-bot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with counting-bot.  If not, see <http://www.gnu.org/licenses/>.

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