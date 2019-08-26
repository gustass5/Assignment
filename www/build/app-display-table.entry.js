import { r as registerInstance, e as createEvent, h } from './core-ab078d9e.js';

const DisplayTable = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.initialData = [];
        this.keys = ["gender", "nat", "email"];
        this.data = [];
        this.dataToDisplay = [];
        this.globalKeyword = "";
        this.columnKeywords = ["", "", ""];
        this.columnSort = ["", "", ""];
        this.page = 1;
        this.nextPage = () => {
            if (this.data.length % this.pageSize === 0) {
                if (this.page < this.data.length / this.pageSize) {
                    this.page = this.page + 1;
                }
            }
            else {
                if (this.page <= this.data.length / this.pageSize) {
                    this.page = this.page + 1;
                }
            }
        };
        this.prevPage = () => {
            if (this.page > 1) {
                this.page = this.page - 1;
            }
        };
        this.getData = createEvent(this, "getData", 7);
    }
    componentDidLoad() {
        this.getDataHandler();
    }
    componentWillRender() {
        this.handleData();
    }
    getDataHandler() {
        this.getData.emit({
            url: this.url,
            results: this.results,
            callback: data => {
                this.initialData = data.results;
                this.data = data.results;
            }
        });
    }
    handleData() {
        let index;
        this.data = this.initialData;
        if (this.globalKeyword !== "") {
            this.filterGlobally();
        }
        if (!this.columnKeywords.every(function (item) {
            return item === "";
        })) {
            this.filterColumn();
        }
        if (!this.columnSort.every(function (item) {
            return item === "";
        })) {
            let order = this.columnSort.find(function (item) {
                return item !== "";
            });
            index = this.columnSort.findIndex(function (item) {
                return item !== "";
            });
            this.sortColumn(this.keys[index], order);
        }
    }
    filterGlobally() {
        let tempKeys = this.keys;
        let gWords = this.globalKeyword.split(" ");
        for (let i = 0; i < gWords.length; i++) {
            this.data = this.data.filter(function (item) {
                for (let j = 0; j < tempKeys.length; j++) {
                    if (item[tempKeys[j]].toLowerCase().includes(gWords[i].toLowerCase())) {
                        return true;
                    }
                    // if (item[tempKeys[j]].toLowerCase() === gWords[i].toLowerCase()) {
                    //   return true;
                    // }
                }
            });
        }
    }
    filterColumn() {
        let tempKeys = this.keys;
        for (let i = 0; i < this.columnKeywords.length; i++) {
            if (this.columnKeywords[i] !== "") {
                let keyWords = this.columnKeywords[i].split(" ");
                for (let j = 0; j < keyWords.length; j++) {
                    this.data = this.data.filter(function (item) {
                        // if (
                        //   item[tempKeys[i]]
                        //     .toLowerCase()
                        //     .includes(keyWords[j].toLowerCase())
                        // ) {
                        //   return true;
                        // }
                        if (item[tempKeys[i]].toLowerCase() === keyWords[j].toLowerCase()) {
                            return true;
                        }
                    });
                }
            }
        }
    }
    sortColumn(key, order) {
        this.data = this.data.sort(this.compareValues(key, order));
    }
    compareValues(key, order = "asc") {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }
            const varA = typeof a[key] == "string" ? a[key].toLowerCase() : a[key];
            const varB = typeof b[key] == "string" ? b[key].toLowerCase() : b[key];
            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            }
            else if (varB > varA) {
                comparison = -1;
            }
            return order == "desc" ? comparison * -1 : comparison;
        };
    }
    changeGlobalKeyword(e) {
        this.globalKeyword = e.target.value.toString();
    }
    changeColumnKeyword(e, key) {
        this.columnKeywords = this.columnKeywords.map((item, index) => {
            if (index === key) {
                return e.target.value.toString();
            }
            else {
                return item;
            }
        });
    }
    changeOrder(key) {
        let temporaryValue;
        if (this.columnSort[key] === "" || this.columnSort[key] === "asc") {
            temporaryValue = "desc";
        }
        else {
            temporaryValue = "asc";
        }
        this.columnSort = this.columnSort.map((item, index) => {
            if (index === key) {
                item = temporaryValue;
            }
            else {
                item = "";
            }
            return item;
        });
    }
    render() {
        let temp = this.pageSize * (this.page - 1);
        let dataToDisplay = this.data.slice(temp, temp + this.pageSize);
        return (h("div", { className: "bigWrapper" }, h("div", { className: "header" }, h("div", { className: "headerText" }, "Search"), h("input", { value: this.globalKeyword, onChange: e => {
                this.changeGlobalKeyword(e);
            } })), h("div", { className: "tableHeader" }, h("div", { className: "field" }, h("div", { className: "sortBtn", onClick: () => {
                this.changeOrder(0);
            } }, "Gender \u2207"), h("input", { value: this.columnKeywords[0], onChange: e => {
                this.changeColumnKeyword(e, 0);
            } })), h("div", { className: "field" }, h("div", { className: "sortBtn", onClick: () => {
                this.changeOrder(1);
            } }, "Nationality \u2207"), h("input", { value: this.columnKeywords[1], onChange: e => {
                this.changeColumnKeyword(e, 1);
            } })), h("div", { className: "field" }, h("div", { className: "sortBtn", onClick: () => {
                this.changeOrder(2);
            } }, "Email Adress \u2207"), h("input", { value: this.columnKeywords[2], onChange: e => {
                this.changeColumnKeyword(e, 2);
            } }))), this.initialData.length === 0 ? (h("div", { className: "popUp" }, "Loading...")) : (h("div", null, h("table", null, h("tbody", null, dataToDisplay.length !== 0 ? (dataToDisplay.map(row => (h("tr", null, h("td", null, row.gender), h("td", null, row.nat), h("td", null, row.email))))) : (h("div", { className: "popUp" }, "No results found")))), h("div", { className: "footer" }, h("div", { className: "btn", onClick: this.prevPage }, "Previous Page"), h("div", { className: "pageNumber" }, this.page), h("div", { className: "btn", onClick: this.nextPage }, "Next Page"))))));
    }
    static get style() { return "body {\n  background-color: #282c34;\n}\n.bigWrapper {\n  width: 900px;\n  margin: 0 auto;\n  font-family: \"roboto\";\n  color: #abb2bf;\n}\n\ninput {\n  background: none;\n  border-color: #61afef;\n  color: #61afef;\n}\n\n.header {\n  width: 100%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  padding: 1rem 0;\n  color: #61afef;\n  font-weight: 800;\n}\n\n.headerText {\n  margin-right: 0.5rem;\n}\n\n.sortBtn:hover {\n  color: white;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.tableHeader {\n  display: -ms-flexbox;\n  display: flex;\n  padding: 0.5rem 0;\n  color: #61afef;\n  font-weight: 800;\n}\n\n.field {\n  width: 300px;\n}\n\n.footer {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  margin-top: 1rem;\n}\n\n.btn {\n  width: 100px;\n  text-align: center;\n  border: 2px solid#61afef;\n  color: #61afef;\n  padding: 0.5rem;\n  margin: 0 0.5rem;\n  border-radius: 5px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.btn:hover {\n  cursor: pointer;\n  color: white;\n  border-color: white;\n}\n\n.pageNumber {\n  margin: 0 1rem;\n  color: #61afef;\n  font-size: 2rem;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\ntable {\n  width: 100%;\n}\ntr {\n  height: 25px;\n}\n\ntr:nth-child(even) {\n  background-color: #21252b;\n}\ntd {\n  width: 300px;\n}\n\n.popUp {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: center;\n  justify-content: center;\n  color: tomato;\n  font-weight: bold;\n  font-size: 2rem;\n}"; }
};

export { DisplayTable as app_display_table };
