import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
// https://vite.dev/config/
export default defineConfig({
    base: "./",
    server: {
        port: 5137,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: "\n        @use \"@/styles/base/variables.scss\" as *;\n        @use \"@/styles/base/mixins.scss\" as *;\n      ",
            },
        },
    },
    plugins: [
        vue(),
        AutoImport({
            imports: [
                "vue",
                {
                    "naive-ui": [
                        "useDialog",
                        "useMessage",
                        "useNotification",
                        "useLoadingBar",
                    ],
                },
            ],
        }),
        Components({
            resolvers: [NaiveUiResolver()],
        }),
    ],
});
