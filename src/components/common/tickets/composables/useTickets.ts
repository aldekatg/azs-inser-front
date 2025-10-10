import { onMounted, computed } from "vue"
import { useTicketData } from "./useTicketData"
import { useTicketColumns } from "./useTicketColumns"
import { useTicketTabs } from "./useTicketTabs"

export function useTickets() {
  const ticketData = useTicketData()
  const ticketColumns = useTicketColumns()
  const ticketTabs = useTicketTabs()

  const currentTab = computed(() =>
    ticketTabs.getTabByType(ticketData.filters.value.ticket_type)
  )

  const initializeTickets = async () => {
    console.log("Инициализация заявок...")
    ticketData.initializeFromRoute()
    await ticketData.loadTickets()
  }

  onMounted(() => {
    console.log("Компонент Tickets смонтирован")
    initializeTickets()
  })

  return {
    // Data
    data: ticketData.tickets,
    loading: ticketData.loading,
    pagination: ticketData.pagination,
    filters: ticketData.filters,

    // UI State
    hasData: ticketData.hasData,
    currentTab,

    // Columns
    columns: ticketColumns.columns,

    // Tabs
    tabs: ticketTabs.tabs,

    // Actions
    changeTicketType: ticketData.changeTicketType,
    changePage: ticketData.changePage,
    updatePageSize: ticketData.updatePageSize,
    handleSorterChange: ticketData.handleSorterChange,
    navigateToTicket: ticketData.navigateToTicket,
    navigateToCreate: ticketData.navigateToCreate,
    refreshTickets: () => ticketData.loadTickets(),
    applyFilters: ticketData.applyFilters,
  }
}
