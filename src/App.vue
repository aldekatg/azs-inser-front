<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-config-provider :date-locale="dateRuRU" :locale="ruRU">
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-config-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<script setup lang="ts">
  import { ruRU, dateRuRU } from "naive-ui"
  import { useAuthStore } from "@/store/useAuthStore.ts"

  const authStore = useAuthStore()

  const token = localStorage.getItem("token")
  const refreshToken = localStorage.getItem("refreshToken")
  authStore.initAuth(token as string, refreshToken as string)
</script>

<style scoped></style>
