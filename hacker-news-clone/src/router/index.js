import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DetailsView from "@/views/DetailsView.vue";

const routes = [
  {
    path: "/",
    name: "PostList",
    component: HomeView,
  },
  {
    path: "/details/:postId",
    name: "PostDetails",
    component: DetailsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
