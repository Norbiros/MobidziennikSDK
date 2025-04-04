import { Module } from '../module';
import { Utils } from '../utils';
import { Message, MessageBody } from '../models/messages/message';
import { Attachment } from '../models/messages/attachment';
import { User } from '../models/user';

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { AxiosResponse } from 'axios';

export class Messages extends Module {
    public async getMessages(): Promise<Message[]> {
        const text = await this.webGet('/dziennik/wiadomosci/?sortuj_wg=otrzymano&sortuj_typ=desc&odebrane=1');
        const $ = cheerio.load(text);
        const messages: Message[] = [];
        $('tr.podswietl').each((i, e) => {
            const tds = $(e).find('td');

            const message: Message = {
                id: $(e).attr('rel') || '',
                topic: $(tds[0]).text().trim(),
                attachments: parseInt($(tds[1]).find('strong').text().trim() || '0', 10),
                isStarred: $(tds[2]).text().includes('★'),
                sender: Utils.parseUser($(tds[3]).text().trim()),
                seen: $(tds[5]).text().includes('Tak'),
            };
            messages.push(message);
        });
        return messages;
    }

    public async getMessage(id: string): Promise<MessageBody> {
        const text = await this.webGet(`/dziennik/wiadodebrana/?id=${id}`);
        const $ = cheerio.load(text);
        const content = $('.wiadomosc_tresc');

        const metadata = content.find('div:last-child');
        const [senderText, sendText, readText] =
            metadata
                .html()
                ?.split('<br>')
                .map((item) => item.trim())!;

        const title = $('#content > h1').first().text().trim();

        const body = content.contents().filter((index, element) => {
            const div = $(element);
            return !(div.text().includes('nadawca:') && element.type === 'tag' && div.prop('tagName') === 'DIV');
        });

        const bodyText = body
            .map((index, element) => {
                const textContent = $(element).text();
                return textContent.replace(/div/g, '\n');
            })
            .get();

        const recipients: User[] = [];
        if ($('.spis > tbody > tr.naglowek').text().includes('Odbiorca')) {
            $('.spis > tbody > tr:not(.naglowek)').each((i, e) => {
                const tds = $(e).find('td');
                const fullName = tds.eq(0).text().trim().split(' ');
                recipients.push({
                    name: fullName[1]!,
                    surname: fullName[0]!,
                    type: tds.eq(1).text().trim(),
                });
            });
        }

        const attachments: Attachment[] = [];
        $('#zalaczniki > li > a').each((i, e) => {
            attachments.push({
                url: $(e).attr('href') || '',
                name: $(e).text().trim(),
            });
        });

        return {
            title,
            content: bodyText.join('\n'),
            html: body
                .map((index, element) => $(element))
                .get()
                .join(''),
            sender: Utils.parseUser(senderText!.replace('nadawca: ', '')),
            sendDate: Utils.parseMessageDate(sendText!.replace('czas wysłania: ', '')),
            readDate: Utils.parseMessageDate(readText!.replace('czas przeczytania: ', '')),
            attachments,
            recipients,
        };
    }

    public async sendMessage(topic: string, content: string, recipients: string[]): Promise<void> {
        const urlParams = new URLSearchParams({
            nazwa: topic,
            tresc: content,
            widok_odbiorcow: '1',
            typodbiorcow: '4',
            file: '',
        });

        for (const recipient of recipients) {
            urlParams.append('odbiorcy[]', recipient);
        }

        await this.webPost(`/dziennik/dodajwiadomosc`, urlParams);
    }

    async downloadAttachment(url: string, destinationPath: string): Promise<void> {
        const response: AxiosResponse<fs.ReadStream> = await this.api.axios.get(url, {
            responseType: 'stream',
        });

        if (response.status !== 200) {
            throw new Error(`Failed to download file. Status code: ${response.status}`);
        }

        const writer = fs.createWriteStream(destinationPath);

        await new Promise<void>((resolve, reject) => {
            response.data.pipe(writer);

            writer.on('finish', resolve);
            writer.on('error', (error) => reject(new Error(`Error while writing to file: ${error}`)));
        });
    }
}
