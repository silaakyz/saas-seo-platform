import { Module } from '@nestjs/common';
import { HtmlParserService } from './html-parser.service';
import { DateExtractorService } from './date-extractor.service';

@Module({
    providers: [HtmlParserService, DateExtractorService],
    exports: [HtmlParserService, DateExtractorService],
})
export class ParserModule { }
