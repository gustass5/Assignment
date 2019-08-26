import { Component, h, Prop, Event, EventEmitter, State } from "@stencil/core";

@Component({
  tag: "app-display-table",
  styleUrl: "display-table.css"
})
export class DisplayTable {
  initialData = [];
  keys = ["gender", "nat", "email"];

  @State() data = [];
  @State() dataToDisplay = [];
  @State() globalKeyword: string = "";
  @State() columnKeywords = ["", "", ""];
  @State() columnSort = ["", "", ""];

  @State() page: number = 1;

  @Prop() pageSize: number;
  @Prop() url: string;
  @Prop() results: number;
  @Event() getData: EventEmitter;

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
    let index: number;
    this.data = this.initialData;
    if (this.globalKeyword !== "") {
      this.filterGlobally();
    }

    if (
      !this.columnKeywords.every(function(item) {
        return item === "";
      })
    ) {
      this.filterColumn();
    }

    if (
      !this.columnSort.every(function(item) {
        return item === "";
      })
    ) {
      let order = this.columnSort.find(function(item) {
        return item !== "";
      });

      index = this.columnSort.findIndex(function(item) {
        return item !== "";
      });

      this.sortColumn(this.keys[index], order);
    }
  }

  filterGlobally() {
    let tempKeys = this.keys;
    let gWords = this.globalKeyword.split(" ");
    for (let i = 0; i < gWords.length; i++) {
      this.data = this.data.filter(function(item) {
        for (let j = 0; j < tempKeys.length; j++) {
          if (
            item[tempKeys[j]].toLowerCase().includes(gWords[i].toLowerCase())
          ) {
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
          this.data = this.data.filter(function(item) {
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
    return function(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = typeof a[key] == "string" ? a[key].toLowerCase() : a[key];
      const varB = typeof b[key] == "string" ? b[key].toLowerCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varB > varA) {
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
      } else {
        return item;
      }
    });
  }

  changeOrder(key) {
    let temporaryValue: string;
    if (this.columnSort[key] === "" || this.columnSort[key] === "asc") {
      temporaryValue = "desc";
    } else {
      temporaryValue = "asc";
    }

    this.columnSort = this.columnSort.map((item, index) => {
      if (index === key) {
        item = temporaryValue;
      } else {
        item = "";
      }
      return item;
    });
  }

  nextPage = () => {
    if (this.data.length % this.pageSize === 0) {
      if (this.page < this.data.length / this.pageSize) {
        this.page = this.page + 1;
      }
    } else {
      if (this.page <= this.data.length / this.pageSize) {
        this.page = this.page + 1;
      }
    }
  };

  prevPage = () => {
    if (this.page > 1) {
      this.page = this.page - 1;
    }
  };

  render() {
    let temp = this.pageSize * (this.page - 1);

    let dataToDisplay = this.data.slice(temp, temp + this.pageSize);

    return (
      <div className="bigWrapper">
        <div className="header">
          <div className="headerText">Search</div>
          <input
            value={this.globalKeyword}
            onChange={e => {
              this.changeGlobalKeyword(e);
            }}
          ></input>
        </div>

        <div className="tableHeader">
          <div className="field">
            <div
              className="sortBtn"
              onClick={() => {
                this.changeOrder(0);
              }}
            >
              Gender &#8711;
            </div>
            <input
              value={this.columnKeywords[0]}
              onChange={e => {
                this.changeColumnKeyword(e, 0);
              }}
            ></input>
          </div>

          <div className="field">
            <div
              className="sortBtn"
              onClick={() => {
                this.changeOrder(1);
              }}
            >
              Nationality &#8711;
            </div>
            <input
              value={this.columnKeywords[1]}
              onChange={e => {
                this.changeColumnKeyword(e, 1);
              }}
            ></input>
          </div>

          <div className="field">
            <div
              className="sortBtn"
              onClick={() => {
                this.changeOrder(2);
              }}
            >
              Email Adress &#8711;
            </div>
            <input
              value={this.columnKeywords[2]}
              onChange={e => {
                this.changeColumnKeyword(e, 2);
              }}
            ></input>
          </div>
        </div>
        {this.initialData.length === 0 ? (
          <div className="popUp">Loading...</div>
        ) : (
          <div>
            <table>
              <tbody>
                {dataToDisplay.length !== 0 ? (
                  dataToDisplay.map(row => (
                    <tr>
                      <td>{row.gender}</td>
                      <td>{row.nat}</td>
                      <td>{row.email}</td>
                    </tr>
                  ))
                ) : (
                  <div className="popUp">No results found</div>
                )}
              </tbody>
            </table>
            <div className="footer">
              <div className="btn" onClick={this.prevPage}>
                Previous Page
              </div>
              <div className="pageNumber">{this.page}</div>
              <div className="btn" onClick={this.nextPage}>
                Next Page
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
