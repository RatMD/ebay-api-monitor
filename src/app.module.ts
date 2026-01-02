import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('HOST'),
                port: +configService.get('PORT'),
                username: configService.get('USERNAME'),
                password: configService.get('PASSWORD'),
                database: configService.get('DATABASE'),
                entities: [],
                synchronize: false,
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
