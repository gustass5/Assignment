import { Component, h } from "@stencil/core";

@Component({
  tag: "app-root"
})
export class AppRoot {
  render() {
    return (
      <app-fetch-data>
        <app-display-table
          url="https://randomuser.me/api/?results="
          results={200}
          pageSize={25}
          keys={["gender", "nat", "email"]}
        ></app-display-table>
      </app-fetch-data>
    );
  }
}
