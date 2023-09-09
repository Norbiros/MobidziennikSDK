import {User} from "./models/user";

export class Utils {
    public static parseMessageDate(date: string): Date {
        const values = date.split(' ');
        const day = parseInt(values[1], 10);
        const month = this.monthToNumber(values[2]);
        const year = parseInt(values[3], 10);
        const [hour, minute, seconds] = values[5].split(":").map(e => parseInt(e, 10))
        return new Date(year, month, day, hour, minute, seconds);
    }

    public static parseUser(userText: string): User {
        const [, surname, name, userType]: string[] = userText.match(/^(.*?)\s(.*?)\s\((.*?)\)$/) || [];
        return {
            name,
            surname,
            type: userType.split(",")[0]
        }
    }

    public static monthToNumber(month: string): number {
        const months = [
            "stycznia",
            "lutego",
            "marca",
            "kwietnia",
            "maja",
            "czerwca",
            "lipca",
            "sierpnia",
            "września",
            "października",
            "listopada",
            "grudnia"
        ]
        return months.indexOf(month);
    }
}