import { Emoji, Collection, Snowflake } from 'discord.js';
import { EmojiCollection } from '../model';

export interface EmojiCache {
    has(id: string): boolean;
    get(id: string): any;
    buildFromCollection(id: string, emojiCollection: Collection<Snowflake, Emoji>): void;
    onUpdate(emoji: Emoji): void;
    onDelete(emoji: Emoji): void;
}

export class EmojiInMemoryCache implements EmojiCache {
    private static cache: EmojiCollection;
    private get cache(): EmojiCollection {
        if (!EmojiInMemoryCache.cache) {
            EmojiInMemoryCache.cache = new EmojiCollection();
        }
        return EmojiInMemoryCache.cache;
    }

    has(id: string): boolean { return !!this.cache[id]; }

    get(id: string): any { return this.cache[id]; }

    buildFromCollection(id: string, emojiCollection: Collection<Snowflake, Emoji>): void {
        this.cache[id] = EmojiCollection.Default;
        emojiCollection.forEach((emoji: Emoji) => {
            this.onUpdate(emoji);
        });
    }

    onUpdate(emoji: Emoji): void {
        const id = emoji.guild.id;
        if (!this.cache[id]) {
            this.cache[id] = EmojiCollection.Default;
        }
        if (emoji.name === 'upvote') {
            this.cache[id].Upvote = emoji.id;
        }
        if (emoji.name === 'downvote') {
            this.cache[id].Downvote = emoji.id;
        }
    }

    onDelete(emoji: Emoji): void {
        const id = emoji.guild.id;
        if (!this.cache[id]) {
            this.cache[id] = EmojiCollection.Default;
        }
        if (emoji.name === 'upvote') {
            this.cache[id].Upvote = '🔥';
        }
        if (emoji.name === 'downvote') {
            this.cache[id].Downvote = '🍆';
        }
    }
}