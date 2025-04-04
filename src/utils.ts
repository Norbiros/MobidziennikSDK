import type { User } from './models/user';

export function parseMessageDate(date: string): Date {
    const values = date.split(' ');
    if (values.length < 6) {
        throw new Error('Invalid date format');
    }

    const day = Number.parseInt(values[1], 10);
    const month = monthToNumber(values[2]);
    const year = Number.parseInt(values[3], 10);
    const [hour, minute, seconds] = values[5]
        .split(':')
        .map((e) => Number.parseInt(e, 10));

    return new Date(year, month, day, hour, minute, seconds);
}

export function parseUser(userText: string): User {
    const [, surname, name, userType]: string[] =
        userText.match(/^(.*?)\s(.*?)\s\((.*?)\)$/) || [];
    return {
        name: name,
        surname: surname,
        type: (userType?.includes(',')
            ? userType.split(',')[0]
            : userType) as string,
    };
}

export function isLoggedIn(text: string) {
    if (
        text === 'Nie jestes zalogowany' ||
        text.includes('przypomnij_haslo_email') ||
        text.includes('Podano niepoprawny login i/lub hasło')
    ) {
        throw new Error('Not logged in');
    }
}

export function monthToNumber(month: string): number {
    const months = [
        'stycznia',
        'lutego',
        'marca',
        'kwietnia',
        'maja',
        'czerwca',
        'lipca',
        'sierpnia',
        'września',
        'października',
        'listopada',
        'grudnia',
    ];
    return months.indexOf(month);
}
