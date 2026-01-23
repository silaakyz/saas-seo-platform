import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('sites')
export class Site {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column()
    domain: string;

    @Column({ nullable: true })
    sitemap_url: string;

    @Column({ default: 'WORDPRESS' })
    cms_type: string;

    @Column('simple-json', { nullable: true })
    cms_credentials: any;

    @Column('simple-json', { nullable: true })
    settings: any;

    @OneToMany(() => Article, (article) => article.site)
    articles: Article[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
