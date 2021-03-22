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