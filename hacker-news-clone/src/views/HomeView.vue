<template>
  <div class="post-list">
    <div class="search">
      <input
        type="text"
        placeholder="Search stories by title, url or author"
        v-model.trim="query"
        @input="handleSearch"
      />
    </div>

    <div>
      <h3 v-if="loading">Loading...</h3>
      <div v-else-if="error">
        <span>An error has occured.</span>&nbsp;&nbsp;
        <button @click="retry">Retry</button>
      </div>

      <div v-else-if="displayedPosts.length">
        <div
          v-for="post in displayedPosts"
          :key="post.id"
          @click="viewPost(post)"
          class="post-container"
        >
          <h3>{{ post.title }}</h3>
          <p>{{ post.by }} - {{ post.score }} points</p>
        </div>
      </div>

      <h3 v-else-if="mode === 'search'">No results for your search term!</h3>
    </div>

    <div ref="scrollTrigger" class="scroll-trigger"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HNService } from "@/services/HNService";

const router = useRouter();
const hnService = new HNService();
const topStoryIds = ref([]);
const posts = ref([]);
const page = ref(0);
const limit = 20;
const query = ref("");
const searchResults = ref([]);
const observer = ref(null);
const scrollTrigger = ref(null);
const loading = ref(false);
const error = ref(false);

const mode = computed(() => (query.value ? "search" : "list"));
const displayedPosts = computed(() => {
  return mode.value === "search" ? searchResults.value : posts.value;
});

const loadTopStories = async () => {
  loading.value = true;
  try {
    error.value = false;
    topStoryIds.value = await hnService.fetchTopStories();
  } catch (e) {
    error.value = true;
  }
  loadMore();
};

const loadMore = async () => {
  const start = page.value * limit;
  const end = start + limit;
  const ids = topStoryIds.value.slice(start, end);

  try {
    error.value = false;
    const newPosts = await hnService.fetchPosts(ids);
    posts.value.push(...newPosts);
    page.value += 1;
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  if (mode.value === "search") {
    error.value = false;
    hnService.debounceSearch(query.value, (results) => {
      if (results) {
        searchResults.value = results;
      } else {
        error.value = true;
      }
    });
  } else {
    searchResults.value = [];
  }
};

const retry = () => {
  error.value = false;
  mode.value === "search" ? handleSearch() : loadMore();
};

const viewPost = (post) => {
  router.push({
    name: "PostDetails",
    params: { postId: post.objectID || post.id },
  });
};

const initializeObserver = () => {
  observer.value = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (mode.value === "list") {
        loadMore();
      }
    }
  });

  if (scrollTrigger.value) {
    observer.value.observe(scrollTrigger.value);
  }
};

const disconnectObserver = () => {
  if (observer.value && scrollTrigger.value) {
    observer.value.unobserve(scrollTrigger.value);
    observer.value.disconnect();
  }
};

onMounted(() => {
  loadTopStories();
  initializeObserver();
});

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>

<style scoped>
.post-container {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fff;
}
.post-container:hover {
  background-color: #f9f9f9;
}

.post-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search {
  width: 100%;
  margin-bottom: 20px;
}

.search input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;
}

.scroll-trigger {
  height: 1px;
}
</style>
