import { Component, h, Prop, Event, EventEmitter, State } from "@stencil/core";

@Component({
  tag: "app-display-table",
  styleUrl: "display-table.css"
})
export class DisplayTable {
  initialData = [];

  @State() data = [];
  @State() dataToDisplay = [];
  @State() globalKeyword: string = "";
  @State() columnKeywords = [];
  @State() columnSort = [];

  @State() page: number = 1;

  @Prop() keys = [];
  @Prop() pageSize: number;
  @Prop() url: string;
  @Prop() results: number;
  @Event() getData: EventEmitter;

  componentDidLoad() {
    this.getDataHandler();
    const newArray = new Array(this.keys.length).fill("");
    this.columnKeywords = newArray;
    this.columnSort = newArray;
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
            if (
              item[tempKeys[i]]
                .toLowerCase()
                .includes(keyWords[j].toLowerCase())
            ) {
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
    this.resetPage();
  }

  changeColumnKeyword(e, key) {
    this.columnKeywords = this.columnKeywords.map((item, index) => {
      if (index === key) {
        return e.target.value.toString();
      } else {
        return item;
      }
    });
    this.resetPage();
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

  resetPage = () => {
    this.page = 1;
  };

  render() {
    let temp = this.pageSize * (this.page - 1);

    let dataToDisplay = this.data.slice(temp, temp + this.pageSize);

    return (
      <div class="bigWrapper">
        <div class="header">
          <div class="headerText">Search</div>
          <input
            value={this.globalKeyword}
            onChange={e => {
              this.changeGlobalKeyword(e);
            }}
          ></input>
        </div>

        <div class="tableHeader">
          {this.keys.map((key, index) => {
            return (
              <div class="field">
                <div
                  class="sortBtn"
                  onClick={() => {
                    this.changeOrder(index);
                  }}
                >
                  {key} &#8711;
                </div>
                <input
                  value={this.columnKeywords[index]}
                  onChange={e => {
                    this.changeColumnKeyword(e, index);
                  }}
                ></input>
              </div>
            );
          })}
        </div>
        {this.initialData.length === 0 ? (
          <div class="popUp">Loading...</div>
        ) : (
          <div>
            <table>
              <tbody>
                {dataToDisplay.length !== 0 ? (
                  dataToDisplay.map(row => (
                    <tr>
                      {this.keys.map(key => {
                        return <td>{row[key]}</td>;
                      })}
                    </tr>
                  ))
                ) : (
                  <div class="popUp">No results found</div>
                )}
              </tbody>
            </table>
            <div class="footer">
              <div class="btn" onClick={this.prevPage}>
                Previous Page
              </div>
              <div class="pageNumber">{this.page}</div>
              <div class="btn" onClick={this.nextPage}>
                Next Page
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
