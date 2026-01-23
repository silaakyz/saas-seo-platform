import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity('article_versions')
export class ArticleVersion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    article_id: string;

    @ManyToOne(() => Article, (article) => article.versions)
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @Column()
    version_number: number;

    @Column('text')
    content_raw: string;

    @Column('text', { nullable: true })
    content_processed: string;

    @Column('simple-json', { nullable: true })
    focus_keywords: string[];

    @Column({ type: 'int', default: 0 })
    seo_score: number;

    @Column('text', { nullable: true })
    change_summary: string;

    @CreateDateColumn()
    created_at: Date;
}
