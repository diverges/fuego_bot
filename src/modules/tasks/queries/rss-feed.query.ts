import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import Parser from 'rss-parser'

export type CustomFeed = { link: string; title: string }
export type CustomItem = { title: string; link: string; isoDate: string }

export type RssFeedEntry = { title: string; link: string; isoDate: string }

export class RssFeedQuery {
    constructor(public readonly url: string, public readonly latest = false) {}
}

@QueryHandler(RssFeedQuery)
export class RssFeedQueryHandler implements IQueryHandler<RssFeedQuery> {
    async execute(query: RssFeedQuery): Promise<RssFeedEntry[]> {
        // Assumes "http://www.w3.org/2005/Atom" format
        try {
            const parser: Parser<CustomFeed, CustomItem> = new Parser({})
            const data = await parser.parseURL(query.url)
            if (query.latest && data.items.length) {
                return [
                    {
                        title: data.items[0].title,
                        link: data.items[0].link,
                        isoDate: data.items[0].isoDate
                    }
                ]
            }
            return data.items.map((item) => ({
                title: item.title,
                link: item.link,
                isoDate: item.isoDate
            }))
        } catch (error) {
            console.error(error.message)
            return []
        }
    }
}
