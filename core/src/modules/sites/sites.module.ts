import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { SitesController } from './sites.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
    imports: [TypeOrmModule.forFeature([Site]), QueueModule],
    controllers: [SitesController],
    exports: [TypeOrmModule],
})
export class SitesModule { }
