<template>
  <div class="tree-component">
    <n-input
      v-model:value="pattern"
      placeholder="Поиск технического задания"
      clearable
    />
    <n-tree
      block-line
      :pattern="pattern"
      :data="treeData"
      :show-irrelevant-nodes="false"
      :default-expanded-keys="defaultExpanded"
    >
      <!-- Временно отключено для будущего использования -->
      <!-- :default-checked-keys="defaultChecked" -->
      <!-- checkable -->
      <!-- :check-strategy="checkStrategy" -->
      <!-- @update:checked-keys="handleCheckedKeys" -->
    </n-tree>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue"
  import type { TreeOption } from "naive-ui"
  import { TechnicalTaskDetail } from "@/api/tickets/types.ts"

  const props = defineProps<{
    source: TechnicalTaskDetail[] // словарь (полное дерево)
    preselected?: TechnicalTaskDetail[] // предвыбранные элементы
  }>()

  // const emit = defineEmits<{
  //   (e: "update:selectedKeys", data: TechnicalTaskDetail[]): void
  // }>()

  const makeParentKey = (pid: number) => `tt:${pid}`
  const makeChildKey = (pid: number, cid: number) => `wt:${pid}:${cid}`

  const pattern = ref("")
  const treeData = computed<TreeOption[]>(() => toTree(props.source))
  const defaultExpanded = ref<string[]>([])
  const defaultChecked = ref<string[]>([])

  // Временно отключено для будущего использования
  // const checkStrategy = ref("all")

  function toTree(data: TechnicalTaskDetail[]): TreeOption[] {
    return data.map((tt) => ({
      key: makeParentKey(tt.id!),
      label: tt.code + " - " + tt.description.slice(0, 100),
      children: tt.work_types?.length
        ? tt.work_types.map((wt) => ({
            key: makeChildKey(tt.id!, wt.id!),
            label: `${wt.code} - ${wt.description}`,
            isLeaf: true,
          }))
        : undefined,
      isLeaf: !tt.work_types?.length,
    }))
  }

  // Автоматически раскрываем все узлы для лучшего отображения
  defaultExpanded.value = props.source
    .filter((tt) => tt.id != null)
    .map((tt) => makeParentKey(tt.id!))

  // Обработка предвыбранных элементов
  watch(
    () => props.preselected,
    (preselected) => {
      if (preselected && preselected.length > 0) {
        const checkedKeys: string[] = []
        preselected.forEach((item) => {
          if (item.id) {
            checkedKeys.push(makeParentKey(item.id))
          }
        })
        defaultChecked.value = checkedKeys
      }
    },
    { immediate: true }
  )

  // Обработка выбора элементов
  // function handleCheckedKeys(checkedKeys: string[]) {
  //   const selectedTasks: TechnicalTaskDetail[] = []

  //   checkedKeys.forEach((key) => {
  //     if (key.startsWith("tt:")) {
  //       // Родительский элемент (ТЗ)
  //       const taskId = parseInt(key.replace("tt:", ""))
  //       const task = props.source.find((t) => t.id === taskId)
  //       if (task) {
  //         selectedTasks.push(task)
  //       }
  //     } else if (key.startsWith("wt:")) {
  //       // Дочерний элемент (тип работы) - добавляем родительский ТЗ
  //       const parts = key.replace("wt:", "").split(":")
  //       const taskId = parseInt(parts[0])
  //       const task = props.source.find((t) => t.id === taskId)
  //       if (task && !selectedTasks.find((t) => t.id === taskId)) {
  //         selectedTasks.push(task)
  //       }
  //     }
  //   })

  //   emit("update:selectedKeys", selectedTasks)
  // }
</script>

<style scoped lang="scss">
  .tree-component {
    flex-direction: column;
    display: flex;
    gap: rem(20);
    min-height: rem(150);
  }
</style>
