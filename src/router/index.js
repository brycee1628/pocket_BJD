import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Detail from "../pages/Detail.vue";
import Edit from "../pages/Edit.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/detail/:id",
        name: "Detail",
        component: Detail,
    },
    {
        path: "/edit/:id",
        name: "Edit",
        component: Edit,
    }
];

const router = createRouter({
    history: createWebHistory("/pocket_BJD/"),
    routes,
});

export default router;
