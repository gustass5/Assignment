import { r as registerInstance, h } from './core-ab078d9e.js';

const AppRoot = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("app-fetch-data", null, h("app-display-table", { url: "https://randomuser.me/api/?results=", results: 200, pageSize: 25 })));
    }
};

export { AppRoot as app_root };
