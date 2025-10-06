<template>
  <div class="ticket-details">
    <div v-if="!loading" class="ticket-details__body">
      <n-form :model="formValue" :rules="rules" ref="formRef">
        <section id="main-info">
          <n-grid :y-gap="12" :x-gap="12" cols="1 500:2 800:3">
            <n-form-item-gi label="Номер заявки" path="ticket_number">
              <n-input
                v-model:value="formValue.ticket_number"
                clearable
                :loading="loading"
                placeholder="Введите номер заявки"
              />
            </n-form-item-gi>
            <n-form-item-gi label="Дата подачи заявки" path="submitted_at">
              <n-date-picker
                v-model:value="computedSubmittedAt"
                type="datetime"
                :default-value="new Date().getTime()"
                format="dd-MM-yyyy HH:mm:ss"
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi label="ФИО подавшего заявку">
              <n-input
                placeholder="Введите ФИО"
                :value="ticket?.gas_station.operator_name"
                :disabled="isUpdateForm"
              />
            </n-form-item-gi>
            <n-form-item-gi label="Критичность" path="criticality">
              <n-select
                v-model:value="formValue.criticality"
                :options="criticalityOptions"
                filterable
                :loading="loading"
              />
            </n-form-item-gi>
            <n-form-item-gi label="Статус" path="status">
              <n-select
                v-model:value="formValue.status"
                :options="getStatusOptions"
                filterable
                :loading="loading"
              />
            </n-form-item-gi>
            <n-form-item-gi label="Описание заявки" path="content">
              <n-input
                v-model:value="formValue.content"
                type="textarea"
                :loading="loading"
              />
            </n-form-item-gi>
          </n-grid>
        </section>
        <n-divider />

        <section id="technical-tasks" v-if="isUpdateForm">
          <div class="technical-tasks">
            <n-h2>Техническое задание</n-h2>
          </div>
          <technical-tasks-tree
            @update:selected-keys="getSelectedTasks"
            :preselected="formValue.technical_tasks_details"
          />
        </section>
      </n-form>
      <n-divider />
      <div>
        <n-h2>QR-код для закрытия заявки</n-h2>
        <n-qr-code :value="qrCode" />
      </div>

      <n-divider />

      <div class="ticket-details__action">
        <n-button type="primary" @click="saveTicket" :loading="loading">
          Сохранить
        </n-button>
        <n-button secondary @click="$router.back()">Отмена</n-button>
      </div>
    </div>
    <ticket-details-skeleton
      v-else
      :is-has-warehouse-guid="!!isHasWarehouseGuid"
      :is-planned-ticket="isPlannedTicket"
      :is-update-form="isUpdateForm"
    />
  </div>
</template>

<script lang="ts" setup>
  import TechnicalTasksTree from "@/components/common/tickets/ticket-details/sections/TechnicalTasksTree.vue"
  import TicketDetailsSkeleton from "@/components/common/tickets/ticket-details/sections/TicketDetailsSkeleton.vue"
  import {
    TechnicalTaskDetail,
    TicketCreatePayload,
    TicketDetails,
    TicketUpdatePayload,
  } from "@/api/tickets/types.ts"
  import { criticalityOptions, statusOptions } from "@/utils"
  import { config } from "@/config/config"
  const { type, formData, loading, rules, ticket, ticketId } = defineProps<
    | {
        type: "create"
        loading: boolean
        rules: any
        ticket?: null
        formData: TicketCreatePayload
        ticketId?: undefined
      }
    | {
        type: "change"
        loading: boolean
        rules: any
        ticket?: TicketDetails
        formData: TicketUpdatePayload
        ticketId: number
      }
  >()

  const emit = defineEmits<{
    (e: "create", data: TicketCreatePayload): void
    (e: "update", data: TicketUpdatePayload, ticketId: number): void
  }>()

  const formValue = ref<TicketCreatePayload | TicketUpdatePayload>(formData)

  const getStatusOptions = computed(() => {
    // if (isUpdateForm.value) {
    //   return statusOptions.filter((status) => status.value !== StatusType.NEW)
    // }
    return statusOptions
  })

  const isHasWarehouseGuid = computed(() => {
    return ticket?.employee?.warehouse?.guid
  })

  const isPlannedTicket = computed(() => {
    return ticket?.ticket_type === "planned"
  })

  const isUpdateForm = computed(() => type === "change")

  function getSelectedTasks(selected: TechnicalTaskDetail[]) {
    formValue.value.technical_tasks_details = selected
    // Обновляем technical_tasks_preview как массив строк (коды)
    formValue.value.technical_tasks_preview = selected.map((task) => task.code)
  }

  function saveTicket() {
    if (isUpdateForm.value && ticketId) {
      emit("update", formValue.value as TicketUpdatePayload, ticketId)
    } else {
      emit("create", formValue.value as TicketCreatePayload)
    }
  }

  // Date pickers expect number (timestamp). Convert ISO/string/Date ⇄ number
  const computedSubmittedAt = computed<number | null>({
    get: () => toTimestamp(formValue.value.submitted_at),
    set: (val) =>
      (formValue.value.submitted_at = fromTimestamp(
        val,
        formValue.value.submitted_at
      )),
  })

  function toTimestamp(
    value: string | number | Date | undefined | null
  ): number | null {
    if (value === undefined || value === null || value === "") return null
    if (typeof value === "number") return value
    if (value instanceof Date) return value.getTime()
    const parsed = Date.parse(value as string)
    return Number.isNaN(parsed) ? null : parsed
  }

  function fromTimestamp(
    value: number | null,
    fallback?: string | number | Date
  ): string | number | Date {
    if (value === null) return fallback ?? new Date().toISOString()
    return new Date(value).toISOString()
  }

  const qrCode = computed(() => {
    if (!ticket?.guid || !ticketId) return ""
    return `${config.QR_BASE_URL}/confirmQR?guid=${ticket.guid}&id=${ticketId}`
  })

  watch(
    () => formData,
    (newVal) => {
      if (newVal) {
        formValue.value = { ...newVal }
      }
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .ticket-details {
    margin-bottom: rem(40);

    &__action {
      display: flex;
      justify-content: flex-end;
      gap: rem(10);
      margin: rem(20) 0;
    }
  }

  .technical-tasks {
    display: flex;
    align-items: self-start;
    justify-content: flex-start;
    gap: rem(10);
  }
</style>
