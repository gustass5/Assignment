import { Component, Listen } from "@stencil/core";

@Component({
  tag: "app-fetch-data"
})
export class FetchData {
  @Listen("getData")
  async getDataHandler(event: CustomEvent) {
    const data = await this.fetchData(event.detail.url, event.detail.results);
    event.detail.callback(data);
  }

  async fetchData(url: string, results: number) {
    try {
      const response = await fetch(url + results.toString());
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
