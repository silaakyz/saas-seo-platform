# Technical Design Document: Autonomous SEO & Content Engine

> **Role**: Senior Software Architect & Product Designer
> **Goal**: Design a sustainable, modular, and autonomous content/SEO engine.
> **Constraint**: Optimized for a single developer, scalable architecture.

## 1. Core Architecture & Technology Stack

### Architectural Style: Event-Driven Modular Monolith
For a single developer, a full Microservices architecture is too much operational overhead. A **Modular Monolith** is the sweet spot: it enforces strict boundaries between modules (Crawler, Parser, Core, AI, Publisher) but runs as a single deployable unit. We will use **Event-Driven Architecture (EDA)** for asynchronous communication (e.g., "ArticleFound" event triggers "KeywordAnalysis" service), which ensures the system is non-blocking and scalable.

### Technology Stack Recommendation
*   **Runtime**: **Node.js (TypeScript)**.
    *   *Why?* Best-in-class for I/O heavy operations (crawling), massive ecosystem for scraping (Puppeteer/Playwright), and shares types between backend and (future) frontend.
*   **Framework**: **NestJS**.
    *   *Why?* Enforces modular architecture out-of-the-box. Dependency Injection makes testing easier. Great support for queues and scheduling.
*   **Database**: **PostgreSQL**.
    *   *Why?* Relational data integrity is crucial here. Excellent JSONB support for flexible metadata. Unbeatable reliability.
*   **Queue/Scheduler**: **BullMQ (Redis)**.
    *   *Why?* The backbone of an autonomous system. Handles retries, delayed jobs (checking 6 months later), and concurrency.
*   **AI/LLM**: **LangChain** (wrapper) + **OpenAI/Anthropic APIs**.
    *   *Why?* LangChain standardizes interactions. We can swap models easily (e.g., GPT-4o for complex tasks, lighter models for simple ones).
*   **Scraping**: **Crawlee** or **Puppeteer** with **Cheerio**.
    *   *Why?* Crawlee handles proxies, retries, and anti-scraping measures automatically.

---

## 2. Database Schema (PostgreSQL)

We need a robust schema to track sites, articles, keywords, and their many-to-many relationships.

```sql
-- Conceptual Schema

CREATE TABLE sites (
    id UUID PRIMARY KEY,
    url VARCHAR NOT NULL,
    domain VARCHAR NOT NULL,
    sitemap_url VARCHAR,
    cms_type VARCHAR (e.g., 'WORDPRESS'),
    cms_credentials JSONB, -- Encrypted
    created_at TIMESTAMP,
    settings JSONB -- Crawl frequency, tones, etc.
);

CREATE TABLE articles (
    id UUID PRIMARY KEY,
    site_id UUID REFERENCES sites(id),
    original_url VARCHAR NOT NULL UNIQUE,
    title VARCHAR,
    content_raw TEXT, -- HTML or Markdown
    published_at TIMESTAMP, -- Extracted or discovered date
    last_crawled_at TIMESTAMP,
    next_update_at TIMESTAMP, -- For the 6-month scheduler
    status VARCHAR, -- 'DISCOVERED', 'PROCESSED', 'UPDATED', 'PUBLISHED'
    version INT DEFAULT 1,
    vector_embedding VECTOR(1536) -- Optional: for semantic linking later
);

CREATE TABLE keywords (
    id UUID PRIMARY KEY,
    site_id UUID REFERENCES sites(id), -- Keywords are often site-specific contexts
    term VARCHAR NOT NULL,
    link_target_url VARCHAR, -- The URL this keyword should link TO
    priority INT DEFAULT 5,
    created_at TIMESTAMP
);

CREATE TABLE internet_links (
    id UUID PRIMARY KEY,
    source_article_id UUID REFERENCES articles(id),
    target_article_id UUID REFERENCES articles(id),
    keyword_used VARCHAR,
    created_at TIMESTAMP
);

CREATE TABLE article_versions (
    id UUID PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    content TEXT,
    version_number INT,
    generated_reason VARCHAR, -- 'INITIAL_CRAWL', 'SEO_UPDATE_6_MONTHS'
    created_at TIMESTAMP
);
```

---

## 3. Service & Folder Structure (NestJS Style)

The structure reflects the domain modules.

```text
src/
├── common/             # Shared DTOs, utilities, guards
├── config/             # Environment configuration
├── database/           # Migrations, Entity definitions
├── modules/
│   ├── crawler/        # THE NAVIGATOR
│   │   ├── crawler.service.ts   # Orchestrates Crawlee/Puppeteer
│   │   ├── discovery.processor.ts # Handles 'search for new links' jobs
│   │   └── extraction.service.ts # Parse creating header/content/date
│   ├── core/           # THE BRAIN
│   │   ├── sites/      # Site management
│   │   ├── articles/   # Article CRUD & state machine
│   │   └── keywords/   # Keyword management
│   ├── intelligence/   # THE AI
│   │   ├── content-analysis.service.ts # Keyword extraction
│   │   ├── seo-optimizer.service.ts    # Rewrite content logic
│   │   └── linking.engine.ts           # Internal linking logic
│   ├── scheduler/      # THE CLOCK section
│   │   ├── queues.module.ts     # BullMQ setup
│   │   └── cron.service.ts      # Routine checks
│   ├── integrator/     # THE HANDS
│   │   ├── wordpress.adapter.ts # WP REST API integration
│   │   └── webhook.adapter.ts   # Generic webhook support
│   └── api/            # THE DOOR
│       └── controllers/ # Public/Panel endpoints
└── main.ts
```

---

## 4. System Data Flow (Step-by-Step)

### Scenario A: Initial Site Onboarding
1.  **Input**: User enters `https://example.com`.
2.  **Discovery**: `CrawlerModule` fetches the URL. Checks `robots.txt` and `sitemap.xml`.
3.  **Queueing**: Found 100 article URLs. Pushes 100 jobs to `crawling-queue` with a gentle delay (politeness).
4.  **Extraction (Worker)**:
    *   Visits Article URL.
    *   Extracts Title, Body, Date.
    *   *Fallback*: If no date is found in metadata/JSON-LD, uses `Date.now()`.
5.  **Storage**: Saves to `articles` table. Status: `DISCOVERED`.
6.  **Analysis (Async Event)**:
    *   `IntelligenceModule` analyzes title/content.
    *   Extracts potential keywords.
    *   Saves to `keywords` table (if configured to auto-harvest).

### Scenario B: New Article Creation (Internal Linking)
1.  **Trigger**: User (or system) creates a new draft.
2.  **Linking Engine**:
    *   Fetches all active `keywords` for this site.
    *   Scans the new text for these keywords.
    *   **Logic**: If "SEO Automation" is found and maps to `/services/automation`, it wraps the text in an `<a>` tag.
    *   *Constraint*: Only link the first occurrence per 500 words to avoid spamminess.
3.  **Update**: Saves the modified content.

### Scenario C: The "6-Month" Refresher
1.  **Trigger**: `SchedulerModule` runs a daily cron. Finds articles where `next_update_at < NOW()`.
2.  **Job**: Pushes to `update-queue`.
3.  **Execution**:
    *   `CrawlerModule` re-fetches the live page (to get current state).
    *   `IntelligenceModule` (AI) receives: Old Content + Current SEO Trends + Rules.
    *   AI Prompt: "Rewrite this to improve flow and update outdated references, keeping the core message."
4.  **Versioning**: Save new text to `article_versions`.
5.  **Publishing**: `IntegratorModule` pushes update via WordPress API. Update `next_update_at` to +6 months.

---

## 5. Product Roadmap

### Phase 1: MVP (The Crawler & Indexer)
*   **Goal**: Create a "readonly" database of the website's content layout.
*   **Features**:
    *   Input URL -> Crawl -> Save (Title, Link, Date).
    *   Keyword Extraction (Basic TF-IDF or simple LLM call).
    *   Simple Dashboard to view the "Map" of the site.
*   **Deliverable**: A system that says "I know everything on your site".

### Phase 2: v1.0 (The Linker)
*   **Goal**: Active improvement of current content.
*   **Features**:
    *   Keyword Management (User defines "Target URL" for "Keyword").
    *   **Internal Linking Engine**: API endpoint where you send text, get back HTML with links.
    *   Manual trigger for "Scan Site & Add Links".

### Phase 3: v2.0 (The Autonomous Gardener)
*   **Goal**: Full Loop Automation.
*   **Features**:
    *   The "6-Month" Refresher logic.
    *   WordPress write-back integration (Auth & Publishing).
    *   AI Content Rewriting.

---

## 6. Single Developer Development Plan

**Philosophy**: Build the *hardest* thing first (The Crawler/Data Structure), not the easiest (The UI).

1.  **Week 1: Foundations**
    *   Setup NestJS + Postgres + BullMQ (Docker Compose).
    *   Build the `sites` and `articles` schema.
    *   Implement basic Puppeteer crawler to just *visit* a page and log the title.

2.  **Week 2: The Parser & Orchestrator**
    *   Refine Crawler to handle Sitemaps.
    *   Implement the "Date Extraction" logic (Metadata -> H1 Search -> Fallback).
    *   Store data reliably in DB.

3.  **Week 3: Keyword Logic & Linking**
    *   Build `keywords` schema.
    *   Write the pure TypeScript function `injectLinks(text, keywordsMap)`.
    *   Unit test this heavily (regex is tricky).

4.  **Week 4: Scheduler & AI Prototype**
    *   Setup the "Re-crawl" job.
    *   Create a simple LangChain service to "Summarize this article".

5.  **Week 5: WordPress Integration (The "Real" Test)**
    *   Set up a local WP instance.
    *   Write the code to *post* an update to WP.

---

## 7. Risk Analysis & Solutions

### Risk A: Crawler Traps & Blocking
*   **Problem**: Sites block bot IPs; Infinite crawl loops.
*   **Solution**: Use `Crawlee` (handles session rotation). Implement strict `max_depth` (e.g., 3 clicks deep) and `url_pattern` regex (only `/blog/` or `/article/`).

### Risk B: "Hallucinating" Links
*   **Problem**: Simple string matching matches parts of words (e.g., keyword "can" matches inside "s**can**ner").
*   **Solution**: Use strict Tokenization or Regex word boundaries (`\bkeyword\b`). Better yet, use a fast NLP tokenizer to identify noun phrases.

### Risk C: Destructive AI Updates
*   **Problem**: AI rewrites the article and removes critical pricing info or breaks the tone.
*   **Solution**: **Diff-Review Mode**. In MVP/v1, *never* auto-publish. Save as "Draft" in WordPress, or send a notification for human approval. Only "High Confidence" trivial changes should go live automatically.

### Risk D: Database Bloat
*   **Problem**: Storing HTML versions every 6 months explodes storage.
*   **Solution**: Store `diff`s (deltas) instead of full text for versions, or prune old versions > 3 (keep only last 3).
