import { NestFactory } from '@nestjs/core'
import 'source-map-support/register'
import { AppModule } from './app/app.module'

async function bootstrap() {
    await NestFactory.createApplicationContext(AppModule)
}
bootstrap()
