import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/pocket_BJD/",
    plugins: [vue()],
    server: {
        port: 3000,
        open: true,
    },
});
