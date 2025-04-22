import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/PocketBJD/",
    plugins: [vue()],
    server: {
        port: 3000,
        open: true,
    },
});
