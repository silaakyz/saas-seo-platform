import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Article])],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class ArticlesModule { }
