import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { Messages } from './modules/messages';
import { Library } from './modules/library';

export class MobidziennikAPI {
    readonly axios: AxiosInstance;
    readonly schoolId: string;
    private readonly cookie: CookieJar;

    // Modules
    public messages: Messages = new Messages(this);
    public library: Library = new Library(this);

    constructor(schoolId: string) {
        this.schoolId = schoolId;
        this.cookie = new CookieJar();
        this.axios = wrapper(
            axios.create({
                jar: this.cookie,
                withCredentials: true,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
                    Information:
                        'MobidziennikAPI - Unofficial Mobidziennik API for Node.js (https://github.com/Norbiros/MobidziennikAPI)',
                },
            }),
        );
    }

    authorize(email: string, pass: string): Promise<boolean> {
        return this.axios
            .post(
                `https://${this.schoolId}.mobidziennik.pl/dziennik`,
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
