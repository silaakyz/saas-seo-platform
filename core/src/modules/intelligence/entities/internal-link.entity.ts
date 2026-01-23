import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('internal_links')
export class InternalLink {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    source_article_id: string;

    @ManyToOne(() => Article, (article) => article.outgoing_links)
    @JoinColumn({ name: 'source_article_id' })
    source_article: Article;

    @Column()
    target_article_id: string;

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'target_article_id' })
    target_article: Article;

    @Column()
    keyword_used: string;

    @Column({ type: 'float', default: 0 })
    relevance_score: number;

    @CreateDateColumn()
    created_at: Date;
}
