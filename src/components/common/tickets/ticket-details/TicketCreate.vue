<template>
  <div class="tickets-component">
    <div class="tickets-component__header">
      <NIcon size="30">
        <ArrowBackCircleOutline
          @click="$router.back()"
          style="cursor: pointer"
        />
      </NIcon>
      <h1>Создание заявки</h1>
    </div>

    <ticket-details
      :form-data="formValue"
      :loading="loading"
      :rules="rules"
      @create="createTicket($event as TicketCreatePayload)"
      type="create"
    />
  </div>
</template>
<script setup lang="ts">
  import TicketDetails from "@/components/common/tickets/ticket-details/TicketDetails.vue"
  import { ArrowBackCircleOutline } from "@vicons/ionicons5"
  import { TicketCreatePayload } from "@/api/tickets/types.ts"
  import { useTicketDetailsHelper } from "@/components/common/tickets/ticket-details/composables/useTicketDetailsHelper.ts"

  const loading = ref(false)
  const formValue = ref<TicketCreatePayload>({
    status: "",
    criticality: "",
    ticket_type: "customer_call",
    ticket_number: "",
    submitted_at: new Date().getTime(),
    technical_tasks_preview: [],
    technical_tasks_details: [],
    content: "",
  })

  const rules = {
    gas_station_id: {
      type: "number",
      required: true,
      message: "АЗС обязательна",
      trigger: ["blur", "change"],
    },
    status: {
      type: "string",
      required: true,
      message: "Статус обязателен",
      trigger: ["blur", "change"],
    },
    criticality: {
      type: "string",
      required: true,
      message: "Критичность обязательна",
      trigger: ["blur", "change"],
    },
    ticket_type: {
      type: "string",
      required: true,
      message: "Тип заявки обязателен",
      trigger: ["blur", "change"],
    },
    content: {
      type: "string",
      required: true,
      message: "Описание обязательно",
      trigger: ["blur", "input"],
    },
    employee_id: {
      type: "number",
      required: true,
      message: "Ответственный обязателен",
      trigger: ["blur", "change"],
    },
  }

  const { createTicket } = useTicketDetailsHelper()
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
