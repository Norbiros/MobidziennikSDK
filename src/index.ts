import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { Messages } from './modules/messages';
import { Library } from './modules/library';
import { Calendar } from './modules/calendar';

export class MobidziennikSDK {
    readonly axios: AxiosInstance;
    readonly schoolId: string;
    readonly schoolUrl: string;
    readonly cookie: CookieJar;

    // Modules
    public messages: Messages = new Messages(this);
    public library: Library = new Library(this);
    public calendar: Calendar = new Calendar(this);

    constructor(schoolId: string) {
        this.schoolId = schoolId;
        this.schoolUrl = `https://${schoolId}.mobidziennik.pl`;
        this.cookie = new CookieJar();
        this.axios = wrapper(
            axios.create({
                jar: this.cookie,
                withCredentials: true,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
                    Information:
                        'MobidziennikSDK - Unofficial Mobidziennik SDK for Node.js (https://github.com/Norbiros/MobidziennikSDK)',
                },
            }),
        );
    }

    authorize(email: string, pass: string): Promise<boolean> {
        return this.axios
            .post(
                `${this.schoolUrl}/dziennik`,
                new URLSearchParams({
                    login: email,
                    haslo: pass,
                }),
            )
            .then((e) => {
                return e.data;
            })
            .catch((e: Promise<boolean>) => {
                console.error(e);
                return false;
            });
    }
}
