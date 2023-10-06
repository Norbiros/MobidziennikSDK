import { MobidziennikAPI } from './index';
import { AxiosResponse } from 'axios';
import { Utils } from './utils';

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
                    Utils.loggedInCheck(el, resolve, reject);
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
                    Utils.loggedInCheck(el, resolve, reject);
                })
                .catch((e) => {
                    console.error(e);
                    reject(e);
                });
        });
    }
}
