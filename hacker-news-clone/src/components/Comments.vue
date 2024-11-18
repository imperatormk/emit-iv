<template>
  <div class="comments">
    <div v-if="loading" class="loading">Loading comments...</div>

    <div v-else-if="comments.length">
      <div
        v-for="comment in comments"
        :key="comment.id"
        :id="'comment-' + comment.id"
        class="comment-item"
      >
        <div class="comment-header">
          <span class="comment-author">By: {{ comment.by }}</span>
          <span class="comment-time">{{ formatDate(comment.time) }}</span>
          <span class="copy-link" @click="copyCommentUrl(comment.id)"
            >Copy preview 🔗</span
          >
        </div>
        <p v-html="comment.text" class="comment-text" />

        <template v-if="comment.kids">
          <p
            v-if="!displaySubcommentsMap[comment.id]"
            class="show-subcomments"
            @click="toggleSubcomments(comment.id)"
          >
            Show {{ comment.kids.length }} comments
          </p>
          <div v-else>
            <Comments
              :commentIds="comment.kids"
              :targetCommentId="targetCommentId"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { HNService } from "@/services/HNService";
import Comments from "./Comments.vue";

const props = defineProps({
  commentIds: {
    type: Array,
    default: () => [],
  },
  targetCommentId: {
    type: Number,
    default: null,
  },
});

const hnService = new HNService();
const comments = ref([]);
const displaySubcommentsMap = ref({});
const loading = ref(false);

const loadComments = async () => {
  loading.value = true;
  comments.value = await hnService.fetchComments(props.commentIds);
  loading.value = false;

  await nextTick();

  if (props.targetCommentId) {
    const targetComment = comments.value.find(
      (comment) => comment.id === props.targetCommentId
    );
    if (targetComment) {
      await scrollToComment(props.targetCommentId);
    }
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

onMounted(loadComments);

watch(() => props.commentIds, loadComments);

const copyCommentUrl = (id) => {
  const url = `${window.location.origin}${window.location.pathname}?commentId=${id}`;
  navigator.clipboard.writeText(url);
};

const scrollToComment = async (id) => {
  const element = document.getElementById(`comment-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const toggleSubcomments = (commentId) => {
  displaySubcommentsMap.value[commentId] =
    !displaySubcommentsMap.value[commentId];
};
</script>

<style scoped>
.comments {
  margin-left: 20px;
}

.comment-item {
  margin-bottom: 20px;
  padding-left: 20px;
  border-left: 3px solid #ccc;
}

.comment-header {
  color: #555;
  margin-bottom: 5px;
}

.comment-author {
  font-weight: bold;
}

.comment-time {
  margin-left: 10px;
}

.copy-link {
  margin-left: 10px;
  color: #007bff;
  cursor: pointer;
}

.comment-text {
  margin: 10px 0;
}

.show-subcomments {
  color: #007bff;
  cursor: pointer;
}

.loading {
  color: gray;
}
</style>
