import { MobidziennikSDK } from './index';
import { Utils } from './utils';

export class Module {
    protected api: MobidziennikSDK;

    constructor(api: MobidziennikSDK) {
        this.api = api;
    }

    protected async webGet(url: string) {
        const response = await this.api.axios.get(`https://${this.api.schoolId}.mobidziennik.pl${url}`);
        Utils.isLoggedIn(response.data);

        return response.data;
    }

    protected async webPost(url: string, data: URLSearchParams) {
        const response = await this.api.axios.post(`https://${this.api.schoolId}.mobidziennik.pl${url}`, data);
        Utils.isLoggedIn(response.data);

        return response.data;
    }
}
