import { Module } from '../module';
import { Book } from '../models/library/book';

export class Library extends Module {
    public async searchBooks(searchPhrase: string): Promise<Book[]> {
        const text = await this.webPost(
            '/helper/biblioteka?akcja=wyszukiwanie',
            new URLSearchParams({
                fraza: searchPhrase,
            }),
        );

        if (!text.resources) throw new Error(`Invalid response (${text.komunikat})`);
        const resources = text.resources;

        const books: Book[] = [];
        for (const resource in resources) {
            const book = resources[resource] as Book;
            books.push(book);
        }

        return books;
    }
}
