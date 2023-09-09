import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { Messages } from './modules/messages';

export class MobidziennikAPI {
  private readonly cookie: CookieJar;
  readonly axios: AxiosInstance;
  readonly schoolId: string;

  public messages: Messages = new Messages(this);

  constructor(schooldId: string) {
    this.schoolId = schooldId;
    this.cookie = new CookieJar();
    this.axios = wrapper(
      axios.create({
        jar: this.cookie,
        withCredentials: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
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
          info: 'MobidziennikAPI - Unofficial Mobidziennik API for Node.js (https://github.com/Norbiros/MobidziennikAPI)',
        }),
      )
      .then((e) => {
        // console.log(e.data)
        return e.data;
      })
      .catch((e: Promise<boolean>) => {
        console.error(e);
        return false;
      });
  }
}
