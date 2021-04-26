import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessageResponse, Wit } from 'node-wit'

@Injectable()
export class WitService {
    private witAi: Wit

    constructor(private readonly configService: ConfigService) {
        this.witAi = new Wit({ accessToken: this.configService.get<string>('WIT_TOKEN') ?? '' })
    }

    public async message(message: string): Promise<MessageResponse> {
        return this.witAi.message(message, {})
    }
}
