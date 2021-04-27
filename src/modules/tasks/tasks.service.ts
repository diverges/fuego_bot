import { Injectable, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { RssFeedCommand } from './commands/rss-feed.command'
import { Feed } from './entities/feed.entity'

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name)

    constructor(@InjectRepository(Feed) private feedRepository: Repository<Feed>, private readonly commandBus: CommandBus) {}

    @Cron('0 * * * *')
    async handleCron() {
        await this.commandBus.execute(new RssFeedCommand())
    }

    async findAll() {
        return this.feedRepository.find()
    }

    async findAllByChannelId(channelId: string): Promise<Feed[]> {
        return this.feedRepository.find({ where: { channelId: channelId } })
    }

    async findAllByType(type: string): Promise<Feed[]> {
        return this.feedRepository.find({ where: { type: type } })
    }

    async create(feed: Feed): Promise<Feed> {
        return this.feedRepository.save(feed)
    }

    async delete(id: string): Promise<DeleteResult> {
        return this.feedRepository.delete(id)
    }

    async removeAll() {
        const entities = await this.findAll()
        if (!entities || !entities.length) return
        return this.feedRepository.remove(entities)
    }
}
