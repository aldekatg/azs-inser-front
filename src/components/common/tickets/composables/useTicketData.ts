import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useMessage, useLoadingBar } from "naive-ui"
import { fetchTickets } from "@/api/tickets"
import { TicketDetails } from "@/api/tickets/types.ts"
import { PaginationType } from "@/types.ts"

export type TicketType = "planned" | "customer_call"

export interface TicketFilters {
  ticket_type: TicketType
  order_by: string
  desc: boolean
  limit: number
  skip: number
  // Новые фильтры
  q?: string | null
  statuses?: string[] | null
  status_group?: string
  gas_station_id?: number | null
  employee_id?: number | null
  guid?: string | null
  submitted_from?: string | null
  submitted_to?: string | null
  created_from?: string | null
  created_to?: string | null
}

export function useTicketData() {
  const message = useMessage()
  const loadingBar = useLoadingBar()
  const router = useRouter()
  const route = useRoute()

  // State
  const loading = ref(false)
  const tickets = ref<TicketDetails[]>([])
  const isInitialized = ref(false)
  const pagination = ref<PaginationType>({
    total: 0,
    page: 1,
    per_page: 10,
    has_next: false,
    has_prev: false,
  })

  const filters = ref<TicketFilters>({
    ticket_type: "customer_call",
    order_by: "id",
    desc: false,
    limit: 10,
    skip: 0,
    // Новые фильтры с пустыми значениями
    q: null,
    statuses: null,
    status_group: undefined,
    gas_station_id: null,
    employee_id: null,
    guid: null,
    submitted_from: null,
    submitted_to: null,
    created_from: null,
    created_to: null,
  })

  // Computed
  const hasData = computed(() => tickets.value.length > 0)

  // Methods
  const updateFilters = (newFilters: Partial<TicketFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const applyFilters = async (newFilters?: Partial<TicketFilters>) => {
    if (newFilters) {
      console.log("applyFilters", newFilters)
      updateFilters(newFilters)
    }
    resetPagination()
    await loadTickets()
  }

  const resetPagination = () => {
    pagination.value.page = 1
    filters.value.skip = 0
  }

  const loadTickets = async (customFilters?: Partial<TicketFilters>) => {
    // Защита от дублирования запросов
    if (loading.value) {
      console.log("Запрос уже выполняется, пропускаем дублирование")
      return
    }

    try {
      loading.value = true
      loadingBar?.start()

      const requestFilters = customFilters
        ? { ...filters.value, ...customFilters }
        : filters.value

      console.log("Загружаем заявки с фильтрами:", requestFilters)
      const response = await fetchTickets(requestFilters)

      if (response.status === "error") {
        throw new Error(response.message || "Ошибка при загрузке заявок")
      }

      tickets.value = response.payload.items
      pagination.value = { ...response.payload }
      isInitialized.value = true
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Не удалось загрузить заявки"

      message.error(errorMessage)
      console.error("Ошибка загрузки заявок:", error)
    } finally {
      loading.value = false
      loadingBar?.finish()
    }
  }

  const changeTicketType = async (type: TicketType) => {
    const oldType = filters.value.ticket_type
    updateFilters({ ticket_type: type })
    resetPagination()

    // Обновляем URL без добавления в историю, но только если тип изменился
    if (oldType !== type) {
      router.replace({ hash: `#${type}` })
    }

    await loadTickets()
  }

  const changePage = async (page: number) => {
    pagination.value.page = page
    const skip = pagination.value.per_page * (page - 1)

    await loadTickets({ skip })
  }

  const updatePageSize = async (size: number) => {
    pagination.value.per_page = size
    pagination.value.page = 1
    filters.value.limit = size
    filters.value.skip = 0

    await loadTickets()
  }

  const navigateToTicket = async (id: number) => {
    try {
      loadingBar?.start()
      await router.push(`/tickets/${id}`)
    } catch (error) {
      loadingBar?.error()
      message.error("Не удалось открыть заявку")
      throw error
    } finally {
      loadingBar?.finish()
    }
  }

  const navigateToCreate = () => {
    router.push({ name: "TicketCreate" })
  }

  // Initialize from route hash
  const initializeFromRoute = () => {
    // Защита от повторной инициализации
    if (isInitialized.value) {
      console.log("Компонент уже инициализирован, пропускаем")
      return
    }

    const hash = (route.hash || "").replace(/^#/, "")
    if (hash === "planned" || hash === "customer_call") {
      filters.value.ticket_type = hash as TicketType
    } else {
      // Если хэша нет, устанавливаем хэш для текущего типа заявки
      const currentType = filters.value.ticket_type || "customer_call"
      router.replace({ hash: `#${currentType}` })
    }
  }

  return {
    // State
    loading,
    tickets,
    pagination,
    filters,

    // Computed
    hasData,

    // Methods
    loadTickets,
    changeTicketType,
    changePage,
    updatePageSize,
    navigateToTicket,
    navigateToCreate,
    initializeFromRoute,
    updateFilters,
    applyFilters,
  }
}
