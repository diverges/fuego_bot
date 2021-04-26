import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db'

export interface FeedEntity extends InMemoryDBEntity {
    channelId: string
    type: string
}
