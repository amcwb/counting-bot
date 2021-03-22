import { Message } from "discord.js";
import { CustomClient } from "../client";

export interface Command {
    name: string,
    description: string,
    admin: boolean,
    run: (client: CustomClient, message: Message, args: string[]) => void,
    requiresConfigModidfication: boolean
}