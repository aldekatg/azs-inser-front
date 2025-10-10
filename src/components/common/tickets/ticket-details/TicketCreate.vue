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
    status: "new",
    criticality: "",
    ticket_type: "customer_call",
    ticket_number: "",
    submitted_at: new Date().getTime(),
    technical_tasks_preview: [],
    technical_tasks_details: [],
    content: "",
  })

  const rules = {
    ticket_number: {
      required: true,
      message: "Номер заявки обязателен",
      trigger: ["blur", "input"],
    },
    submitted_at: {
      required: true,
      type: "number",
      message: "Дата подачи заявки обязательна",
      trigger: ["blur", "change"],
    },
    criticality: {
      required: true,
      message: "Критичность обязательна",
      trigger: ["blur", "change"],
      validator: (_rule: any, value: string) => {
        if (!value || value === "") {
          return new Error("Выберите критичность")
        }
        return true
      },
    },
    status: {
      required: true,
      message: "Статус обязателен",
      trigger: ["blur", "change"],
    },
    content: {
      required: true,
      message: "Описание заявки обязательно",
      trigger: ["blur", "input"],
      validator: (_rule: any, value: string) => {
        if (!value || value.trim() === "") {
          return new Error("Введите описание заявки")
        }
        if (value.length < 10) {
          return new Error("Описание должно содержать минимум 10 символов")
        }
        return true
      },
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
