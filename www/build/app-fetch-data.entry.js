import { r as registerInstance } from './core-ab078d9e.js';

const FetchData = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    async getDataHandler(event) {
        const data = await this.fetchData(event.detail.url, event.detail.results);
        event.detail.callback(data);
    }
    async fetchData(url, results) {
        try {
            const response = await fetch(url + results.toString());
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }
};

export { FetchData as app_fetch_data };
