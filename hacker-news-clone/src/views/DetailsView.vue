<template>
  <div>
    <h3 v-if="loading">Loading...</h3>

    <template v-else-if="post">
      <h1>{{ post.title }}</h1>
      <p>{{ post.by }} - {{ post.score }} points</p>
      <div v-if="post.text" v-html="post.text"></div>

      <div v-if="post.url">
        <a :href="post.url" target="_blank">Read more</a>
      </div>
      <br />

      <div v-if="post.kids && post.kids.length > 0">
        <Comments :commentIds="post.kids" :targetCommentId="targetCommentId" />
      </div>
      <div v-else-if="post.kids && post.kids.length === 0">
        <p>No comments yet, be the first to leave one!</p>
      </div>
    </template>

    <template v-else>
      <p>Post not found or failed to load.</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Comments from "@/components/Comments.vue";
import { HNService } from "@/services/HNService";

const route = useRoute();
const hnService = new HNService();
const post = ref(null);
const targetCommentId = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const postId = route.params.postId;
    post.value = await hnService.fetchPostDetails(postId);

    const commentIdFromUrl = route.query.commentId;
    targetCommentId.value = commentIdFromUrl ?? null;
  } catch (error) {
    post.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
