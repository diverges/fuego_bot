import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DiscordModuleOption, DiscordOptionsFactory, TransformPipe, ValidationPipe } from 'discord-nestjs'

@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createDiscordOptions(): DiscordModuleOption {
        return {
            token: this.configService.get<string>('DISCORD_TOKEN') ?? '',
            commandPrefix: '/',
            usePipes: [TransformPipe, ValidationPipe]
        }
    }
}
