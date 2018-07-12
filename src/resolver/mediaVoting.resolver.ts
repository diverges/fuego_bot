import { Emoji } from 'discord.js';
import { Resolver, Client, Message } from './resolver';
import { EmojiInMemoryCache } from '../util/emojiCache';

export class MediaVotingResolver implements Resolver {
    private emojiCache: EmojiInMemoryCache; // Emoji id's per guild

    constructor() {
        this.emojiCache = new EmojiInMemoryCache();
    }

    onInit(client: Client): boolean {
        client.on('emojiUpdate', (oldEmoji, newEmoji: Emoji) => {
            this.emojiCache.onUpdate(newEmoji);
        });
        client.on('emojiDelete', this.emojiCache.onDelete);
        client.on('messageUpdate', (oldMessage: Message, newMessage: Message) => {
            if (newMessage.embeds.length > 0 || newMessage.attachments.array().length > 0) {
                this.onMessage(newMessage);
            }
        });
        return true;
    }

    isActive(message: Message): boolean {
        return message.embeds.length > 0
            || message.attachments.array().length > 0;
    }

    async onMessage(message: Message): Promise<void> {
        if (!this.emojiCache.has(message.guild.id)) {
            this.emojiCache.buildFromCollection(message.guild.id, message.client.emojis);
        }

        const guildEmoji = this.emojiCache.get(message.guild.id);
        await message.react(guildEmoji.Upvote);
        await message.react(guildEmoji.Downvote);
    }
}