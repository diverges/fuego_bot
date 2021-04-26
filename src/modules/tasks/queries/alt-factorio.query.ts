import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import Parser from 'rss-parser'

export type CustomFeed = { link: string; title: string }
export type CustomItem = { title: string; link: string; isoDate: string }

export type AltFactorioPost = { title: string; link: string }

export class AltFactorioQuery {}

@QueryHandler(AltFactorioQuery)
export class AltFactorioQueryHandler implements IQueryHandler<AltFactorioQuery> {
    async execute(query: AltFactorioQuery): Promise<AltFactorioPost> {
        const parser: Parser<CustomFeed, CustomItem> = new Parser({
            customFields: {
                feed: ['link', 'title'],
                item: ['link', 'title', 'isoDate']
            }
        })
        const data = await parser.parseURL('https://alt-f4.blog/atom.xml')
        return {
            title: data.items[0].title,
            link: data.items[0].link
        }
    }
}
