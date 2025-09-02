import { createReadStream } from 'node:fs';
import * as path from 'node:path';
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

    protected async webUpload(filePath: string) {
        const fileName = path.basename(filePath);
        const url = `https://${this.api.schoolId}.mobidziennik.pl/dziennik/ajaxupload?qqfile=${encodeURIComponent(fileName)}`;

        const stream = createReadStream(filePath);

        const response = await this.api.axios.post(url, stream, {
            headers: { 'Content-Type': 'application/octet-stream' },
        });

        if (!response.data.success) {
            console.warn(`File upload might have failed: ${response.data}`);
        }

        return response.data;
    }
}
