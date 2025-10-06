<template>
  <div class="tickets-component">
    <div class="tickets-component__header">
      <NIcon size="30">
        <ArrowBackCircleOutline
          @click="$router.back()"
          style="cursor: pointer"
        />
      </NIcon>
      <h1 v-if="!loading">Детали заявки № {{ formValue?.ticket_number }}</h1>
      <div style="display: flex; gap: 10px" v-else>
        <n-skeleton width="300px" height="32px" />
        <n-skeleton width="300px" height="32px" round />
      </div>
    </div>

    <ticket-details
      :form-data="formValue"
      :loading="loading"
      :ticket="ticketInfo"
      :rules="rules"
      :ticket-id="Number(route.params.id)"
      @update="updateTicket"
      type="change"
    />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"
  import { useRoute } from "vue-router"

  import { useTicketDetailsHelper } from "@/components/common/tickets/ticket-details/composables/useTicketDetailsHelper.ts"
  import TicketDetails from "@/components/common/tickets/ticket-details/TicketDetails.vue"
  import { ArrowBackCircleOutline } from "@vicons/ionicons5"

  const route = useRoute()

  const {
    rules,
    loading,
    formValue,
    ticketInfo,
    initTicketById,
    updateTicket,
  } = useTicketDetailsHelper()

  onMounted(() => {
    initTicketById(route.params.id)
  })
</script>

<style scoped lang="scss">
  .tickets-component {
    padding: rem(20);

    &__header {
      display: flex;
      align-items: flex-start;
      gap: rem(15);
      margin-bottom: rem(20);
    }
  }
</style>
