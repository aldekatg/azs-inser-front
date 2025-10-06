<template>
  <n-dialog-provider>
    <n-loading-bar-provider>
      <!-- Desktop Layout -->
      <left-nav class="left-navigation">
        <slot />
      </left-nav>
    </n-loading-bar-provider>
  </n-dialog-provider>
</template>

<script setup lang="ts">
  import { onMounted } from "vue"
  import { useTicketData } from "@/components/common/tickets/composables/useTicketData"
  import LeftNav from "@/layouts/LeftNav.vue"
  const { loadTickets } = useTicketData()

  onMounted(() => loadTickets())
</script>

<style lang="scss" scoped>
  .mobile-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .mobile-content {
    flex: 1;
    padding: rem(60) rem(16) rem(16);
    overflow-y: auto;
    background-color: var(--n-color);
  }

  .left-navigation {
    height: 100vh;
  }
</style>
