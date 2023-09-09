import { Module } from '../module';
import { Message } from '../models/message';
import * as cheerio from 'cheerio';

export class Messages extends Module {
  public async getMessages(): Promise<Message[]> {
    const text = await this.webGet('/dziennik/wiadomosci');
    const body = cheerio.load(text);
    const messages: Message[] = [];
    body('tr.podswietl').each((i, e) => {
      const tds = body(e).find('td');
      const message: Message = {
        id: body(e).attr('rel') || '',
        topic: body(tds[0]).text().trim(),
        isStarred: body(tds[2]).text().includes('★'),
        sender: body(tds[3]).text().trim(),
        seen: body(tds[5]).text().includes('Tak'),
      };
      messages.push(message);
    });
    return messages;
  }

  public async getMessage(id: string): Promise<string> {
    const text = await this.webGet(`/dziennik/wiadodebrana/?id=${id}`);
    const body = cheerio.load(text);
    const message = body('.wiadomosc_tresc');
    message.find('div').remove();
    return message.text().trim();
  }
}
