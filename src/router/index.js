import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    }
];

const router = createRouter({
    history: createWebHistory("/pocket_BJD/"),
    routes,
});

export default router;
