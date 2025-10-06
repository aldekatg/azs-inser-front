<template>
  <div style="height: 100vh; position: relative">
    <n-layout position="absolute">
      <n-layout-header style="height: 70px" bordered embedded>
        <n-space
          justify="space-between"
          align="center"
          style="padding: 0 22px 0 22px"
        >
          <n-space @click="goHome" style="cursor: pointer">
            <n-image
              style="pointer-events: none"
              src="/logo.jpg"
              alt="Logo of company"
              :height="64"
            />
          </n-space>
          <n-space>
            <n-dropdown :options="options">
              <n-button size="large" round>
                <template #icon>
                  <n-icon><person-circle-icon /></n-icon>
                </template>
                {{ authStore.user?.name }}
              </n-button>
            </n-dropdown>
          </n-space>
        </n-space>
      </n-layout-header>
      <n-layout-content style="padding: 20px">
        <slot />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, provide } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { NIcon, LayoutInst } from "naive-ui"

  // icons
  import { PersonCircleOutline as PersonCircleIcon } from "@vicons/ionicons5"

  // helpers
  import { useNavHook } from "@/layouts/composables/useNavHook.ts"
  import { useAuthStore } from "@/store/useAuthStore.ts"

  const authStore = useAuthStore()
  const { options } = useNavHook()

  // const contentRef = ref<LayoutInst | null>(null)
  const mainContentBodyRef = ref<LayoutInst | null>(null)
  const route = useRoute()
  const router = useRouter()

  const activeKey = ref<string | null>(null)

  watch(
    () => route.name,
    (name) => {
      console.log(name)
      activeKey.value = (name as string) ?? null
    },
    { immediate: true }
  )

  watch(
    () => route.path,
    (newRoute: any) => {
      console.log(newRoute)
      mainContentBodyRef.value?.scrollTo({ top: 0 })
    }
  )

  // Передаю информацию о позиции скролла через provide/inject
  const scrollTopRef = ref(0)

  provide("layoutScrollTop", scrollTopRef)
  provide("mainContentBodyRef", mainContentBodyRef)

  function goHome() {
    router.push({ name: "Home" })
  }
</script>
<style lang="scss" scoped>
  :deep(
    .n-menu,
    .n-menu-item-content.n-menu-item-content--selected,
    .n-menu-item-content__icon
  ) {
    color: #0085ff !important;
  }
  :deep(
    .n-menu-item-content:not(
        .n-menu-item-content--disabled
      ).n-menu-item-content--selected,
    .n-menu-item-content-header,
    a
  ) {
    color: #0085ff !important;
  }
  :deep(
    .n-menu-item-content:not(
        .n-menu-item-content--disabled
      ).n-menu-item-content--selected::before
  ) {
    background-color: #0085ff1a;
  }
  :deep(
    .n-menu-item-content:not(
        .n-menu-item-content--disabled
      ).n-menu-item-content--selected:hover::before
  ) {
    background-color: #0085ff1a;
  }
  :deep(.n-menu-item) {
    margin-top: 12px !important;
  }
</style>
