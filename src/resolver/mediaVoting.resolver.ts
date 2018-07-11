import * as Discord from 'discord.js';
import { DiscordMessageResolver, Client, Message } from './base.resolver';

// Guild -> (Upvote, Downvote)
class EmojiCollection {
  [id: string]: {
      Upvote: string, Downvote: string
  }

  static get Default(): { Upvote: string, Downvote: string } {
      return { Upvote: '🔥', Downvote: '🍆'}; // default
  }
}

export class MediaVotingResolver implements DiscordMessageResolver {
  private emojiCache: EmojiCollection; // Emoji id's per guild

  constructor() {
    this.emojiCache = new EmojiCollection();
  }

  onInit(client: Client): boolean {
    client.on('emojiUpdate', (oldEmoji, newEmoji: Discord.Emoji) => {
      this.onEmojiUpdate(newEmoji);
    });
    client.on('emojiDelete', this.onEmojiDelete);
    client.on('messageUpdate', (oldMessage: Discord.Message, newMessage: Discord.Message) => {
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
    if (!this.emojiCache[message.guild.id]) {
      this.emojiCache[message.guild.id] = EmojiCollection.Default;
      this.getEmojiFromCollection(message.client.emojis);
    }

    const guildEmoji = this.emojiCache[message.guild.id];
    await message.react(guildEmoji.Upvote);
    await message.react(guildEmoji.Downvote);
  }

  public onEmojiDelete(emoji: Discord.Emoji): void {
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

  public onEmojiUpdate(emoji: Discord.Emoji): void {
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

  private getEmojiFromCollection(emojis: Discord.Collection<Discord.Snowflake, Discord.Emoji>): void {
      emojis.forEach((emoji: Discord.Emoji) => {
          this.onEmojiUpdate(emoji);
      });
  }

}