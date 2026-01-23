import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface Job {
    id: string;
    type: 'CRAWL_SITE' | 'PROCESS_ARTICLE';
    data: any;
}

@Injectable()
export class QueueService {
    private readonly logger = new Logger(QueueService.name);
    private queue: Job[] = [];
    private isProcessing = false;

    constructor(private eventEmitter: EventEmitter2) { }

    async addJob(type: Job['type'], data: any) {
        const job: Job = { id: Date.now().toString(), type, data };
        this.queue.push(job);
        this.logger.log(`Job added: ${type} - ${JSON.stringify(data)}`);
        this.processQueue();
    }

    private async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const job = this.queue.shift();
            if (job) {
                this.logger.log(`Processing job: ${job.id}`);
                try {
                    await this.eventEmitter.emitAsync(job.type, job.data);
                } catch (e) {
                    this.logger.error(`Job failed: ${e.message}`);
                }
            }
        }

        this.isProcessing = false;
    }
}
