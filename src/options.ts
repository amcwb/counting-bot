import * as fs from "fs";
import * as path from 'path';

// For documentation purposes only
export interface Configuration {
    token: string,
    prefix: string,
    countChannelID: string,
    adminRolesIDs?: string[],
    deleteWhenIncorrect?: boolean,
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
        deleteWhenIncorrect: data.deleteWhenIncorrect ?? true,
        errorOnCommandNotFound: data.errorOnCommandNotFound ?? false
    };
}