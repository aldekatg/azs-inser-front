import js from "@eslint/js"
import vue from "eslint-plugin-vue"
import ts from "@typescript-eslint/eslint-plugin"
import globals from "globals"

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vue Composition API globals
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        onUpdated: "readonly",
        onBeforeMount: "readonly",
        onBeforeUnmount: "readonly",
        onBeforeUpdate: "readonly",
        nextTick: "readonly",
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
        defineSlots: "readonly",
        defineModel: "readonly",
        defineOptions: "readonly",
        defineAsyncComponent: "readonly",
        getCurrentInstance: "readonly",
        inject: "readonly",
        provide: "readonly",
        toRef: "readonly",
        toRefs: "readonly",
        unref: "readonly",
        isRef: "readonly",
        shallowRef: "readonly",
        triggerRef: "readonly",
        customRef: "readonly",
        readonly: "readonly",
        isReadonly: "readonly",
        shallowReactive: "readonly",
        shallowReadonly: "readonly",
        toRaw: "readonly",
        markRaw: "readonly",
        effectScope: "readonly",
        getCurrentScope: "readonly",
        onScopeDispose: "readonly",
      },
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.{js,ts,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/max-attributes-per-line": "off",
      "vue/attributes-order": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/require-default-prop": "off",
      "no-unused-vars": "warn",
      "no-console": "warn",
      "no-undef": "off", // Отключаем для Vue файлов, так как глобальные переменные Vue определены выше
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.ts",
      "auto-imports.d.ts",
      "components.d.ts",
    ],
  },
]
