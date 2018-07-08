import { BaseCommand } from "../baseCommand";
import { TextChannel, Message, MessageSearchOptions, MessageSearchResult } from "discord.js";

export default class Sue extends BaseCommand {
    public getName(): string {
        return "sue";
    }

    public async onCallback(payload: Message): Promise<void> {
        const args = payload.content.split(" ");
        if (args.length > 0) {
            const name = args.slice(1, args.length).join(" ");
            const channel = payload.channel as TextChannel;
            if (channel.members) {
                const user = channel.members.find("displayName", name);
                const options: MessageSearchOptions = {
                    author: user,
                    authorType: "user",
                    limit: 1
                };
                const searchResult = await channel.lastMessage;

                await searchResult.react("🅾");
                await searchResult.react("🅱");
                await searchResult.react("🇯");
                await searchResult.react("🇪");
                await searchResult.react("🇨");
                await searchResult.react("🇹");
                await searchResult.react("🇮");
                await searchResult.react("🇴");
                await searchResult.react("🇳");
                await searchResult.react("❗");
            }
        }
    }
}