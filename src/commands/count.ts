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