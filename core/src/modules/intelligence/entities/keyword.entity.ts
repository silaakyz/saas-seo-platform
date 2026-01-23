import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity('keywords')
export class Keyword {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    site_id: string;

    @ManyToOne(() => Site)
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @Column()
    term: string;

    @Column()
    target_url: string;

    @Column({ default: 5 })
    priority: number;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    source_article_id: string;

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'source_article_id' })
    source_article: Article;
}
