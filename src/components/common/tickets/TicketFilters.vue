<template>
  <div class="ticket-filters">
    <n-form
      ref="formRef"
      :model="filters"
      :key="formKey"
      label-width="auto"
      :show-feedback="false"
    >
      <!-- Дополнительные фильтры (скрываются/раскрываются) -->
      <n-collapse-transition :show="isExpanded">
        <div class="ticket-filters__expanded">
          <n-grid cols="1 500:2 800:3" :x-gap="16" :y-gap="16">
            <n-form-item-gi label="Поиск" path="q">
              <n-input
                v-model:value="filters.q"
                placeholder="Поиск по тикету"
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

            <!-- Диапазон дат подачи -->
            <n-form-item-gi label="Дата подачи" path="submitted_range">
              <n-date-picker
                v-model:value="submittedRangeTs"
                type="daterange"
                placeholder="Выберите диапазон дат"
                clearable
                class="w-100"
              />
            </n-form-item-gi>

            <!-- Диапазон дат создания -->
            <n-form-item-gi label="Дата создания" path="created_range">
              <n-date-picker
                v-model:value="createdRangeTs"
                type="daterange"
                placeholder="Выберите диапазон дат"
                clearable
                class="w-100"
              />
            </n-form-item-gi>
          </n-grid>
        </div>
      </n-collapse-transition>

      <!-- Кнопки действий -->
      <div class="ticket-filters__actions">
        <n-button type="info" @click="applyFilters" :loading="loading">
          Применить фильтры
        </n-button>
        <n-button @click="resetFilters">Сбросить</n-button>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-switch
              v-model:value="isExpanded"
              size="medium"
              aria-placeholder=""
              label="Развернуть"
              :rail-style="railStyle"
            >
              <template #checked-icon>
                <n-icon :component="FilterOutline" />
              </template>
              <template #unchecked-icon>
                <n-icon :component="FilterOutline" />
              </template>
            </n-switch>
          </template>
          {{ isExpanded ? "Свернуть фильтры" : "Развернуть фильтры" }}
        </n-tooltip>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from "vue"
  import type { FormInst } from "naive-ui"
  import type { TicketFilters } from "./types"
  import { FilterOutline } from "@vicons/ionicons5"
  import type { CSSProperties } from "vue"

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

  // Промежуточные timestamp-значения для date-picker'ов диапазонов (ожидают [number, number] | null)
  const submittedRangeTs = ref<[number, number] | null>(null)
  const createdRangeTs = ref<[number, number] | null>(null)

  // Синхронизация: TS диапазоны -> ISO в фильтры
  watch(submittedRangeTs, (val) => {
    if (val && val.length === 2) {
      // Используем UTC методы для корректной работы с временными зонами
      const fromDate = new Date(val[0] + 24 * 60 * 60 * 1000)
      const toDate = new Date(val[1])

      // Устанавливаем время в UTC: начало дня для "от" и конец дня для "до"
      const fromIso = new Date(
        Date.UTC(
          fromDate.getUTCFullYear(),
          fromDate.getUTCMonth(),
          fromDate.getUTCDate(),
          0,
          0,
          0,
          0
        )
      ).toISOString()

      const toIso = new Date(
        Date.UTC(
          toDate.getUTCFullYear(),
          toDate.getUTCMonth(),
          toDate.getUTCDate() + 1, // Добавляем +1 день
          23,
          59,
          59,
          999
        )
      ).toISOString()

      emit("update:filters", {
        ...props.filters,
        submitted_from: fromIso,
        submitted_to: toIso,
      })
    } else {
      emit("update:filters", {
        ...props.filters,
        submitted_from: undefined,
        submitted_to: undefined,
      })
    }
  })

  watch(createdRangeTs, (val) => {
    if (val && val.length === 2) {
      // Используем UTC методы для корректной работы с временными зонами
      const fromDate = new Date(val[0])
      const toDate = new Date(val[1])

      // Устанавливаем время в UTC: начало дня для "от" и конец дня для "до"
      const fromIso = new Date(
        Date.UTC(
          fromDate.getUTCFullYear(),
          fromDate.getUTCMonth(),
          fromDate.getUTCDate() + 1, // Добавляем +1 день
          0,
          0,
          0,
          0
        )
      ).toISOString()

      const toIso = new Date(
        Date.UTC(
          toDate.getUTCFullYear(),
          toDate.getUTCMonth(),
          toDate.getUTCDate() + 1, // Добавляем +1 день
          23,
          59,
          59,
          999
        )
      ).toISOString()

      emit("update:filters", {
        ...props.filters,
        created_from: fromIso,
        created_to: toIso,
      })
    } else {
      emit("update:filters", {
        ...props.filters,
        created_from: undefined,
        created_to: undefined,
      })
    }
  })

  // Сброс фильтров при смене типа заявки
  watch(
    () => props.filters.ticket_type,
    (newType, oldType) => {
      if (newType && oldType && newType !== oldType) {
        resetFilters()
      }
    }
  )

  // Опции для селектов
  const statusOptions = [
    { label: "Новая", value: "new" },
    { label: "В работе", value: "in_progress" },
    { label: "Ожидает утверждения", value: "awaiting_approval" },
    { label: "Выполнена (проверена)", value: "done_checked" },
    { label: "Выполнена (не проверена)", value: "done_unchecked" },
    { label: "Отклонена заказчиком", value: "rejected_by_customer" },
  ]

  // Методы
  const applyFilters = () => {
    emit("apply")
  }

  const resetFilters = () => {
    const currentTicketType = props.filters.ticket_type
    const defaultFilters: TicketFilters = {
      ticket_type: currentTicketType,
      order_by: "submitted_at", // Базовая сортировка по дате подачи
      desc: true, // Сначала свежие заявки (по убыванию)
      limit: 10,
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

    // Сбрасываем timestamp'ы для date picker'ов диапазонов
    submittedRangeTs.value = null
    createdRangeTs.value = null

    // Принудительно перерендериваем форму для визуального сброса
    formKey.value++

    emit("update:filters", defaultFilters)
    emit("apply")
  }

  // Стилизация для switch - синий цвет как у info кнопки
  const railStyle = ({
    focused,
    checked,
  }: {
    focused: boolean
    checked: boolean
  }) => {
    const style: CSSProperties = {}
    if (checked) {
      style.background = "#2080f0"
    }
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f0"
    }
    return style
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
    margin-bottom: rem(10);

    &__expanded {
      margin-bottom: rem(20);
      padding-top: rem(20);
      border-top: 1px solid var(--n-border-color);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: rem(12);
      padding-bottom: rem(16);
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

        :deep(.n-switch) {
          width: 100%;
          justify-content: center;
        }

        :deep(.n-tooltip) {
          width: 100%;
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
  }

  .w-100 {
    width: 100%;
  }
</style>
