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

import * as fs from "fs";
import * as path from 'path';

// For documentation purposes only
export interface Configuration {
    token: string,
    prefix: string,
    countChannelID: string,
    adminRolesIDs?: string[],
    errorOnCommandNotFound?: boolean
}

export function loadOptions(): Configuration {
    const rawData = fs.readFileSync(path.join(__dirname, '../config.json'));
    const data = JSON.parse(rawData.toString());
    return {
        token: data.token,
        prefix: data.prefix,
        countChannelID: data.countChannelID,
        adminRolesIDs: data.adminRolesIDs ?? [],
        errorOnCommandNotFound: data.errorOnCommandNotFound ?? false
    };
}