import {MobidziennikAPI} from './index';
import {AxiosResponse} from 'axios';

export class Module {
    protected api: MobidziennikAPI;

    constructor(api: MobidziennikAPI) {
        this.api = api;
    }

    public webGet(url: string) {
        return new Promise<string>((resolve, reject) => {
            this.api.axios
                .get(`https://${this.api.schoolId}.mobidziennik.pl${url}`)
                .then((el: AxiosResponse<any>) => {
                    const text = el.data;
                    if (
                        text === 'Nie jestes zalogowany' ||
                        text.includes('przypomnij_haslo_email' || text.includes('Podano niepoprawny login i/lub hasło'))
                    ) {
                        reject(new Error('Not logged in'));
                    }
                    resolve(text);
                })
                .catch((e) => {
                    console.error(e);
                    reject(e);
                });
        });
    }

    public webPost(url: string, data: any) {
        return new Promise<string>((resolve, reject) => {
            this.api.axios
                .post(`https://${this.api.schoolId}.mobidziennik.pl${url}`, new URLSearchParams(data))
                .then((el: AxiosResponse<any>) => {
                    const text = el.data;
                    if (
                        text === 'Nie jestes zalogowany' ||
                        text.includes('przypomnij_haslo_email' || text.includes('Podano niepoprawny login i/lub hasło'))
                    ) {
                        reject(new Error('Not logged in'));
                    }
                    resolve(text);
                })
                .catch((e) => {
                    console.error(e);
                    reject(e);
                });
        });
    }
}
