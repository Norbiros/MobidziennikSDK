import { Module } from '../module';

import * as cheerio from 'cheerio';
import { CalendarEntry } from '../models/calendar/calendar_entry';

export class Calendar extends Module {
    public async getCalendarEntries(): Promise<CalendarEntry[]> {
        const text = await this.webGet('/dziennik/kalendarzklasowy');
        const $ = cheerio.load(text);
        const scriptTag = $('script[type="text/javascript"]').filter((index, element) => {
            return $(element).text()?.includes('events: [{') || false;
        });

        const script = scriptTag.text();
        const scriptRegex = /events:\s*(\[[\s\S]*?]\s*),/;
        const regexMatch = script?.match(scriptRegex);

        if (!regexMatch || regexMatch.length < 2) {
            throw new Error('Invalid Mobidziennik response');
        }

        const events = JSON.parse(regexMatch[1]);

        return events.map((entry: any): CalendarEntry => {
            return {
                id: entry.id,
                color: entry.color,
                textColor: entry.textColor,
                content: entry.comment,
                start: new Date(entry.start),
                end: new Date(entry.end),
            };
        });
    }
}
