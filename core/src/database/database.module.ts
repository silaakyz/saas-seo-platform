import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'better-sqlite3',
                database: 'autoseo.sqlite',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true, // Auto-schema for MVP
            }),
        }),
    ],
})
export class DatabaseModule { }
