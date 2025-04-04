import type { MobidziennikSDK } from './index';
import { isLoggedIn } from './utils';

export class Module {
    protected api: MobidziennikSDK;

    constructor(api: MobidziennikSDK) {
        this.api = api;
    }

    protected async webGet(url: string) {
        const response = await this.api.axios.get(
            `https://${this.api.schoolId}.mobidziennik.pl${url}`,
        );

        isLoggedIn(response.data);

        return response.data;
    }

    protected async webPost(url: string, data: URLSearchParams) {
        const response = await this.api.axios.post(
            `https://${this.api.schoolId}.mobidziennik.pl${url}`,
            data,
        );
        isLoggedIn(response.data);

        return response.data;
    }
}
