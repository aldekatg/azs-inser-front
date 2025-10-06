<template>
  <BaseTreeSelect
    v-if="!!technical_tasks.length"
    :source="technical_tasks"
    :preselected="preselected"
  >
    <!-- @update:selected-keys="emit('update:selectedKeys', $event)" - временно отключено -->
  </BaseTreeSelect>
  <div v-else class="no-data">
    <n-empty description="Нет данных" />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from "vue"
  import BaseTreeSelect from "@/components/base/BaseTreeSelect.vue"
  import { TechnicalTaskDetail } from "@/api/tickets/types.ts"

  const { preselected } = defineProps<{
    preselected?: TechnicalTaskDetail[]
  }>()

  // const emit = defineEmits<{
  //   (e: "update:selectedKeys", data: TechnicalTaskDetail[]): void
  // }>()

  // Заглушка для технических задач - в реальном проекте это должно приходить с API
  const technical_tasks = ref<TechnicalTaskDetail[]>([])

  onMounted(async () => {
    // Здесь должен быть вызов API для получения технических задач
    // Пока создаем тестовые данные для демонстрации
    technical_tasks.value = [
      {
        id: 1,
        code: "T3-1",
        equipment: "Оборудование 1",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
        work_types: [
          {
            id: 1,
            code: "W1",
            description: "Описание работы 1",
            technical_task_id: 1,
          },
          {
            id: 2,
            code: "W2",
            description: "Описание работы 2",
            technical_task_id: 1,
          },
        ],
        checklists: [],
      },
      {
        id: 2,
        code: "T3-2",
        equipment: "Оборудование 2",
        description:
          "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        work_types: [
          {
            id: 3,
            code: "W3",
            description: "Описание работы 3",
            technical_task_id: 2,
          },
        ],
        checklists: [],
      },
      {
        id: 3,
        code: "T3-3",
        equipment: "Оборудование 3",
        description:
          "When an unknown printer took a galley of type and scrambled it to make a type specimen book",
        work_types: [],
        checklists: [],
      },
    ]
  })
</script>

<style scoped>
  .no-data {
    padding: 40px;
    text-align: center;
  }
</style>
