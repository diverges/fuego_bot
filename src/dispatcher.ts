import * as EventEmitter from 'events';
import * as Discord from "discord.js";
import { Wit, MessageResponse } from "node-wit"; // Wit.ai
import { BaseCommand } from "./baseCommand";
import * as Tesseract from "tesseract.js"
import * as path from "path";
import {Page, Progress} from "tesseract.js";
import {GuildMember, TextChannel} from "discord.js";
import * as Jimp from 'jimp';

// Guild -> (Upvote, Downvote)
class EmojiCollection {
    [id: string]: {
        Upvote: string, Downvote: string
    }

    static get Default(): { Upvote: string, Downvote: string } {
        return { Upvote: '🔥', Downvote: '🍆'}; // default
    }
}

export default class CommandDispatcher extends EventEmitter {
    private config: any;
    private witAi: Wit;
    private emojiCache: EmojiCollection; // Emoji id's per guild

    constructor(config: any) {
        super();
        this.config = config;
        this.emojiCache = new EmojiCollection();
        if (config && config.init) {
            this.witAi = (config.init['wit_token']) ? new Wit({ accessToken: config.init['wit_token'] }) : undefined;
        }
    }

    public async OnMessage (message: Discord.Message): Promise<void> {
        // Ignore messages from bots
        if (message.author.bot) return;

        if (message.content.startsWith(this.config.init['cmd_token'])) {
            // basic command eg. /ping
            const command = message.content.substring(1).split(' ')[0];
            if (this.config.commands.indexOf(command) >= 0) {
                this.emit(command, message);
            }
        }
        else if (this.witAi && message.mentions && message.mentions.users.has(message.client.user.id)) {
            // bot was mentioned, send to wit.ai and emit intent
            const data: MessageResponse = await this.witAi.message(message.content, {});
            if (data.entities && data.entities.intent) {
                this.emit(data.entities.intent[0].value, message);
                console.log('message intent: ' + data.entities.intent[0].value);
            }
        } else if (message.embeds.length > 0 || message.attachments.array().length > 0) {
            this.checkImageForUsers(message);
            return this.sendUpvoteDownvote(message);
        }
    }

    public async sendUpvoteDownvote(message: Discord.Message): Promise<void> {
        if (!this.emojiCache[message.guild.id]) {
            this.emojiCache[message.guild.id] = EmojiCollection.Default;
            this.GetEmojiFromCollection(message.client.emojis);
        }

        const guildEmoji = this.emojiCache[message.guild.id];
        await message.react(guildEmoji.Upvote);
        await message.react(guildEmoji.Downvote);
    }

    public OnEmojiDelete(emoji: Discord.Emoji): void {
        const id = emoji.guild.id;
        if (!this.emojiCache[id]) {
            this.emojiCache[id] = EmojiCollection.Default;
        }
        if (emoji.name === 'upvote') {
            this.emojiCache[id].Upvote = '🔥';
        }
        if (emoji.name === 'downvote') {
            this.emojiCache[id].Downvote = '🍆';
        }
    }

    public OnEmojiUpdate(emoji: Discord.Emoji): void {
        const id = emoji.guild.id;
        if (!this.emojiCache[id]) {
            this.emojiCache[id] = EmojiCollection.Default;
        }
        if (emoji.name === 'upvote') {
            this.emojiCache[id].Upvote = emoji.id;
        }
        if (emoji.name === 'downvote') {
            this.emojiCache[id].Downvote = emoji.id;
        }
    }

    private GetEmojiFromCollection(emojis: Discord.Collection<Discord.Snowflake, Discord.Emoji>): void {
        emojis.forEach((emoji: Discord.Emoji) => {
            this.OnEmojiUpdate(emoji);
        });
    }

    public addCommand(command: BaseCommand): void {
        this.on(command.getName(), command.onCallback);
    }

    public censor(censor: any): any {
        var i = 0;

        return (key: any, value: any) => {
            if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
                return '[Circular]';

            if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
                return '[Unknown]';

            ++i; // so we know we aren't using the original object anymore

            return value;
        }
    }

    public checkImageForUsers(message: Discord.Message): void {
        let media: Array<string> = [];
        for (const em of message.embeds) {
            media.push(em.url)
        }
        for (const at of message.attachments.array()) {
            media.push(at.url)
        }
        let names: Map<string, GuildMember> = new Map<string, GuildMember>();
        if (message.channel instanceof TextChannel) {
            for (const member of message.channel.members.array()) {
                names.set(member.displayName, member)
            }
        }
        for (const url of media) {
            Jimp.read(url).then(value => {
                const contrastLVL = 0.6;
                const thresh = 30;
                console.log('downloaded image');
                value.scaleToFit(value.bitmap.width*2, value.bitmap.height*2).contrast(contrastLVL).scan(0, 0, value.bitmap.width, value.bitmap.height, function (x, y, idx) {
                    const red   = this.bitmap.data[idx ];
                    const green = this.bitmap.data[idx + 1];
                    const blue  = this.bitmap.data[idx + 2];
                    const gray =  (0.299 * red + 0.587 * green + 0.114 * blue);
                    if ( gray > thresh )
                    {
                        // Set the pixel is white.
                        this.bitmap.data[idx] = 255;
                        this.bitmap.data[idx + 1] = 255;
                        this.bitmap.data[idx + 2] = 255;
                        this.bitmap.data[idx + 3] = 255;
                    }
                    else
                    {
                        // Set the pixel is black.
                        this.bitmap.data[idx] = 0;
                        this.bitmap.data[idx + 1] = 0;
                        this.bitmap.data[idx + 2] = 0;
                        this.bitmap.data[idx + 3] = 255;
                    }
                }).getBuffer(value.getMIME(), (err: Error, buffer: Buffer) => {
                    Tesseract.recognize(buffer, {
                        lang: path.join(__dirname, "../langs/eng"),
                        tessedit_pageseg_mode: 4
                    })
                        .progress(function  (p: Progress) { console.log('progress', p)  })
                        .then((result: Page) => {
                            // console.log(result.lines);
                            let mentions: Array<GuildMember> = [];
                            names.forEach((value, key) => {
                                if (result.text.indexOf(key) > -1) {
                                    mentions.push(value);
                                }
                            });
                            mentions.forEach(value => message.reply('got got', { reply: value}))
                        })
                        .catch((err: Error) => console.error(err))
                        .finally((resultOrError) => {
                            if ('text' in resultOrError) {
                                console.log(resultOrError.text)
                            }
                        });
                });
            });
        }
    }
}