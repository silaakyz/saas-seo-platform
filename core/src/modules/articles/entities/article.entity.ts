import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';
import { ArticleVersion } from './article-version.entity';
import { InternalLink } from '../../intelligence/entities/internal-link.entity';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    site_id: string;

    @ManyToOne(() => Site, (site) => site.articles)
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @Column({ unique: true })
    original_url: string;

    @Column({ nullable: true })
    title: string;

    @Column('text', { nullable: true })
    content_raw: string;

    @Column('text', { nullable: true })
    content: string;

    @Column({ type: 'datetime', nullable: true })
    published_at: Date;

    @Column({ type: 'datetime', nullable: true })
    last_crawled_at: Date;

    @Column({ type: 'datetime', nullable: true })
    next_update_at: Date;

    @Column({ default: 'DISCOVERED' })
    status: string;

    @Column({ default: 1 })
    version: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => ArticleVersion, (version) => version.article)
    versions: ArticleVersion[];

    @OneToMany(() => InternalLink, (link) => link.source_article)
    outgoing_links: InternalLink[];
}
