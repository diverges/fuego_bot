export type EmojiCollectionEntry = {
  Upvote: string,
  Downvote: string
};

// Guild -> (Upvote, Downvote)
export class EmojiCollection {
  [id: string]: EmojiCollectionEntry;

  static get Default(): EmojiCollectionEntry {
      return {
        Upvote: '🔥',
        Downvote: '🍆'
      };
  }
}