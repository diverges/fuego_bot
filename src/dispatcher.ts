import * as EventEmitter from "events";
import * as Discord from "discord.js";
import { Wit } from "node-wit"; // Wit.ai
import { BaseCommand } from "./baseCommand";

export default class CommandDispatcher extends EventEmitter {
    private client: Discord.Client;
    private config: any;
    private witAi: Wit;
    private upvote: Discord.Emoji;
    private downvote: Discord.Emoji;

    constructor(client: Discord.Client, config: any) {
        super();
        this.client = client;
        this.config = config;
        if (config && config.init) {
            this.witAi = (config.init["wit_token"]) ? new Wit({ accessToken: config.init["wit_token"] }) : undefined;
        }
        client.on("ready", () => {
            console.log("Client Logged in!");
            this.refreshEmojis();
        });
        client.on("emojiCreate", () => { this.refreshEmojis(); });
        client.on("emojiDelete", () => { this.refreshEmojis(); });
        client.on("emojiUpdate", () => { this.refreshEmojis(); });
        client.on("messageUpdate", (oldMessage: Discord.Message, newMessage: Discord.Message) => {
            this.sendUpvoteDownvote(message);
        });
        client.on("message", (message: Discord.Message) => {
            // Ignore messages from bots
            if (message.author.bot) return;

            if (message.content.startsWith(config.init["cmd_token"])) {
                // basic command eg. /ping
                const command = message.content.substring(1).split(" ")[0];
                if (config.commands.indexOf(command) >= 0) {
                    this.emit(command, message);
                }
            }
            else if (this.witAi && message.mentions && message.mentions.users.has(client.user.id)) {
                // bot was mentioned, send to wit.ai and emit intent
                this.witAi.message(message.content, {})
                    .then((data) => {
                        if (data.entities && data.entities.intent) {
                            this.emit(data.entities.intent[0].value, message);
                            console.log("message intent: " + data.entities.intent[0].value);
                        }
                    });
            } else if (message.embeds.length > 0 || message.attachments.array().length > 0) {
                this.sendUpvoteDownvote(message);
            }
        });
    }

    private sendUpvoteDownvote(message: Discord.Message) {
        if (this.upvote && this.downvote) {
            if (this.client.emojis.get(this.upvote.id) && this.client.emojis.get(this.downvote.id))
                message.react(this.upvote).then((value) => value.message.react(this.downvote));
        }
    }

    private refreshEmojis() {
        console.log("Refreshing Emojis...");
        this.client.emojis.forEach(emoji => {
            if (emoji.name.indexOf("upvote") !== -1) {
                console.log("Found Upvote Emoji: " + emoji.id);
                this.upvote = emoji;
            } else if (emoji.name.indexOf("downvote") !== -1) {
                console.log("Found Downvote Emoji: " + emoji.id);
                this.downvote = emoji;
            }
        });
    }

    public addCommand(command: BaseCommand): void {
        this.on(command.getName(), command.onCallback);
    }
}