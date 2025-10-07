<template>
  <div class="ticket-filters">
    <n-form
      ref="formRef"
      :model="filters"
      :key="formKey"
      label-width="auto"
      :show-feedback="false"
    >
      <!-- Основные фильтры (всегда видны) -->
      <n-grid cols="1 500:2 800:3" :x-gap="16" :y-gap="16">
        <!-- Поиск -->
        <n-form-item-gi label="Поиск" path="q">
          <n-input
            v-model:value="filters.q"
            placeholder="Поиск по тикету/АЗС/сотруднику"
            clearable
            class="w-100"
            @keyup.enter="applyFilters"
          />
        </n-form-item-gi>

        <!-- Статусы -->
        <n-form-item-gi label="Статусы" path="statuses">
          <n-select
            v-model:value="filters.statuses"
            :options="statusOptions"
            placeholder="Выберите статусы"
            multiple
            clearable
            class="w-100"
          />
        </n-form-item-gi>

        <!-- Сортировка -->
        <n-form-item-gi label="Тип заявки" path="ticket_type">
          <n-select
            v-model:value="filters.ticket_type"
            :options="[
              { label: 'Вызовы', value: 'customer_call' },
              { label: 'Планирование', value: 'planned' },
            ]"
            placeholder="Выберите тип заявки"
            class="w-100"
          />
        </n-form-item-gi>
      </n-grid>

      <!-- Дополнительные фильтры (скрываются/раскрываются) -->
      <div v-show="isExpanded" class="ticket-filters__expanded">
        <n-grid cols="1 500:2 800:3" :x-gap="16" :y-gap="16">
          <!-- Сортировка -->
          <n-form-item-gi label="Сортировка" path="order_by">
            <n-select
              v-model:value="filters.order_by"
              :options="orderByOptions"
              placeholder="Поле сортировки"
              class="w-100"
            />
          </n-form-item-gi>
          <!-- АЗС -->
          <n-form-item-gi label="АЗС ID" path="gas_station_id">
            <n-input-number
              v-model:value="filters.gas_station_id"
              placeholder="ID АЗС"
              :min="1"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Сотрудник -->
          <n-form-item-gi label="Сотрудник ID" path="employee_id">
            <n-input-number
              v-model:value="filters.employee_id"
              placeholder="ID сотрудника"
              :min="1"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- GUID -->
          <n-form-item-gi label="GUID" path="guid">
            <n-input
              v-model:value="filters.guid"
              placeholder="GUID"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Дата подачи от -->
          <n-form-item-gi label="Дата подачи от" path="submitted_from">
            <n-date-picker
              v-model:value="submittedFromTs"
              type="datetime"
              placeholder="Выберите дату"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Дата подачи до -->
          <n-form-item-gi label="Дата подачи до" path="submitted_to">
            <n-date-picker
              v-model:value="submittedToTs"
              type="datetime"
              placeholder="Выберите дату"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Дата создания от -->
          <n-form-item-gi label="Дата создания от" path="created_from">
            <n-date-picker
              v-model:value="createdFromTs"
              type="datetime"
              placeholder="Выберите дату"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Дата создания до -->
          <n-form-item-gi label="Дата создания до" path="created_to">
            <n-date-picker
              v-model:value="createdToTs"
              type="datetime"
              placeholder="Выберите дату"
              clearable
              class="w-100"
            />
          </n-form-item-gi>

          <!-- Порядок сортировки -->
          <n-form-item-gi label="Порядок" path="desc">
            <n-select
              v-model:value="filters.desc"
              :options="descOptions"
              placeholder="Порядок сортировки"
              class="w-100"
            />
          </n-form-item-gi>
        </n-grid>
      </div>

      <!-- Кнопки действий -->
      <div class="ticket-filters__actions">
        <n-button type="primary" @click="applyFilters" :loading="loading">
          Применить фильтры
        </n-button>
        <n-button @click="resetFilters">Сбросить</n-button>
        <n-button @click="toggleExpanded" type="tertiary">
          {{ isExpanded ? "Свернуть" : "Развернуть" }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from "vue"
  import type { FormInst } from "naive-ui"
  import type { TicketFilters } from "./types"

  const props = defineProps<{
    filters: TicketFilters
    loading?: boolean
  }>()

  const emit = defineEmits<{
    "update:filters": [value: TicketFilters]
    apply: []
  }>()

  const formRef = ref<FormInst | null>(null)
  const isExpanded = ref(false)
  const formKey = ref(0)

  // Промежуточные timestamp-значения для date-picker'ов (ожидают number)
  const submittedFromTs = ref<number | null>(null)
  const submittedToTs = ref<number | null>(null)
  const createdFromTs = ref<number | null>(null)
  const createdToTs = ref<number | null>(null)

  // Синхронизация: TS -> ISO в фильтры
  watch(submittedFromTs, (val) => {
    const iso = val ? new Date(val).toISOString() : undefined
    emit("update:filters", { ...props.filters, submitted_from: iso })
  })
  watch(submittedToTs, (val) => {
    const iso = val ? new Date(val).toISOString() : undefined
    emit("update:filters", { ...props.filters, submitted_to: iso })
  })
  watch(createdFromTs, (val) => {
    const iso = val ? new Date(val).toISOString() : undefined
    emit("update:filters", { ...props.filters, created_from: iso })
  })
  watch(createdToTs, (val) => {
    const iso = val ? new Date(val).toISOString() : undefined
    emit("update:filters", { ...props.filters, created_to: iso })
  })

  // Опции для селектов
  const statusOptions = [
    { label: "Новая", value: "new" },
    { label: "В работе", value: "in_progress" },
    { label: "Ожидает утверждения", value: "awaiting_approval" },
    { label: "Выполнена (проверена)", value: "done_checked" },
    { label: "Выполнена (не проверена)", value: "done_unchecked" },
    { label: "Отклонена заказчиком", value: "rejected_by_customer" },
  ]

  const orderByOptions = [
    { label: "ID", value: "id" },
    { label: "Дата создания", value: "created_at" },
    { label: "Дата подачи", value: "submitted_at" },
    { label: "Плановое время", value: "planned_finish_at" },
    { label: "Статус", value: "status" },
  ]

  const descOptions = [
    { label: "По возрастанию", value: false },
    { label: "По убыванию", value: true },
  ]

  // Методы
  const applyFilters = () => {
    emit("apply")
  }

  const resetFilters = () => {
    const defaultFilters: TicketFilters = {
      ticket_type: "customer_call",
      order_by: "id",
      desc: false,
      limit: 50,
      skip: 0,
      // Сбрасываем все остальные фильтры - используем null для визуального сброса
      q: null,
      statuses: null,
      gas_station_id: null,
      employee_id: null,
      guid: null,
      submitted_from: null,
      submitted_to: null,
      created_from: null,
      created_to: null,
    }

    // Сбрасываем timestamp'ы для date picker'ов
    submittedFromTs.value = null
    submittedToTs.value = null
    createdFromTs.value = null
    createdToTs.value = null

    // Принудительно перерендериваем форму для визуального сброса
    formKey.value++

    emit("update:filters", defaultFilters)
    emit("apply")
  }

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }
</script>

<style lang="scss" scoped>
  :deep(.n-form-item-label) {
    font-size: rem(14);
    min-width: 140px;
  }

  .ticket-filters {
    background: var(--n-card-color);
    border: 1px solid var(--n-border-color);
    border-radius: var(--n-border-radius);
    margin-bottom: rem(20);

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: rem(12);
      margin-top: rem(20);
      padding-top: rem(16);
      border-top: 1px solid var(--n-border-color);
      flex-wrap: wrap;

      // Адаптивность для мобильных устройств
      @media (max-width: rem(768)) {
        flex-direction: column;
        gap: rem(8);

        :deep(.n-button) {
          width: 100%;
          justify-content: center;
        }
      }

      // Адаптивность для очень маленьких экранов
      @media (max-width: rem(480)) {
        padding: rem(12) rem(16);
        margin-top: rem(16);

        :deep(.n-button) {
          font-size: rem(14);
          padding: rem(8) rem(16);
        }
      }
    }

    &__expanded {
      margin-top: rem(20);
    }
  }

  .w-100 {
    width: 100%;
  }
</style>
