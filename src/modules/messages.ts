import {Module} from '../module';
import {Utils} from "../utils";
import {Message, MessageBody} from '../models/message';
import {Attachment} from "../models/attachment";
import {User} from "../models/user";

import * as cheerio from 'cheerio';
import * as fs from "fs";
import {AxiosResponse} from "axios";

export class Messages extends Module {
    public async getMessages(): Promise<Message[]> {
        const text = await this.webGet('/dziennik/wiadomosci');
        const $ = cheerio.load(text);
        const messages: Message[] = [];
        $('tr.podswietl').each((i, e) => {
            const tds = $(e).find('td');

            const message: Message = {
                id: $(e).attr('rel') || '',
                topic: $(tds[0]).text().trim(),
                attachments: parseInt($(tds[1]).find("strong").text().trim() || '0', 10),
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

        const metadata = content.find('div');
        const [senderText, sendText, readText] = metadata.html()?.split('<br>').map(item => item.trim()) || [];

        const body = content
            .contents()
            .filter((index, element) => {
                return !$(element).is('div');
            })

        const recipients: User[] = [];
        $('.spis > tbody > tr:not(.naglowek)').each((i, e) => {
            const tds = $(e).find("td");
            const fullName = tds.eq(0).text().trim().split(" ");
            recipients.push({
                name: fullName[1],
                surname: fullName[0.],
                type: tds.eq(1).text().trim(),
            });
        })

        const attachments: Attachment[] = []
        $("#zalaczniki > li > a").each((i, e) => {
            attachments.push({
                url: $(e).attr('href') || '',
                name: $(e).text().trim(),
            });
        })

        return {
            body: body.text().trim(),
            sender: Utils.parseUser(senderText.replace("nadawca: ", "")),
            sendDate: Utils.parseMessageDate(sendText.replace("czas wysłania: ", "")),
            readDate: Utils.parseMessageDate(readText.replace("czas przeczytania: ", "")),
            attachments,
            recipients,
        };
    }

    public async sendMessage(topic: string, content: string, recipient: string[]): Promise<void> {
        const url = `/dziennik/dodajwiadomosc`;
        await this.webPost(url, {
            nazwa: topic,
            tresc: content,
            widok_odbiorcow: "1",
            typodbiorcow: "4",
            file: "",
            "odbiorcy[]": recipient,
        });
    }

    async downloadAttachment(url: string, destinationPath: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const response: AxiosResponse<fs.ReadStream> = await this.api.axios.get(url, {responseType: 'stream'});
                if (response.status !== 200)
                    return reject(`Failed to download file. Status code: ${response.status}`);
                const writer = fs.createWriteStream(destinationPath);
                response.data.pipe(writer);
                writer.on('finish', () => resolve());
                writer.on('error', (error) => reject(`Error while writing to file: ${error}`));
            } catch (error) {
                reject(`Error while downloading file: ${error}`);
            }
        });
    }


}
