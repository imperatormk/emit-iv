import axios from "axios";

const http = axios.create({
  adapter: "fetch",
});

export class HNService {
  constructor() {
    this.baseURL = "https://hacker-news.firebaseio.com/v0";
    this.algoliaURL = "https://hn.algolia.com/api/v1";
    this.searchTimer = null;
  }

  async fetchTopStories() {
    const response = await http.get(`${this.baseURL}/topstories.json`);
    return response.data;
  }

  async fetchPostDetails(postId) {
    const response = await http.get(`${this.baseURL}/item/${postId}.json`);
    return response.data;
  }

  async fetchPosts(ids) {
    const promises = ids.map((id) =>
      http.get(`${this.baseURL}/item/${id}.json`).then((res) => res.data)
    );
    return Promise.all(promises);
  }

  async fetchComments(ids) {
    if (!ids.length) return [];
    const promises = ids.map((id) =>
      http.get(`${this.baseURL}/item/${id}.json`).then((res) => res.data)
    );
    return Promise.all(promises);
  }

  debounceSearch(query, callback, delay = 400) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(async () => {
      try {
        const response = await http.get(`${this.algoliaURL}/search`, {
          params: { query, tags: "story" },
        });
        callback(response.data.hits);
      } catch (error) {
        callback(null);
      }
    }, delay);
  }
}
