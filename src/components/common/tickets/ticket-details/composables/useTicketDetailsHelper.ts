import { ref } from "vue"
import { useMessage } from "naive-ui"
import {
  createTicketReq,
  fetchTicketById,
  updateTicketById,
} from "@/api/tickets"
import {
  TicketCreatePayload,
  TicketDetails,
  TicketUpdatePayload,
} from "@/api/tickets/types.ts"
import { useRouter } from "vue-router"

export function useTicketDetailsHelper() {
  const message = useMessage()
  const router = useRouter()

  const ticketInfo = ref<TicketDetails>()
  const loading = ref(false)

  const formValue = ref<TicketUpdatePayload>({
    status: "",
    criticality: "",
    ticket_number: "",
    submitted_at: "",
    technical_tasks_preview: [],
    technical_tasks_details: [],
    content: "",
  })
  const rules = {
    ticket_number: {
      required: true,
      type: "text",
      message: "Номер заявки обязателен",
      trigger: ["blur", "input"],
    },
    status: {
      required: true,
      message: "Статус обязателен",
      trigger: ["blur", "input"],
    },
    criticality: {
      required: true,
      message: "Критичность обязательна",
      trigger: ["blur", "input"],
    },
    submitted_at: {
      required: true,
      type: "string",
      message: "Дата подачи обязательна",
      trigger: ["blur", "change"],
    },
    content: {
      required: true,
      message: "Содержимое заявки обязательно",
      trigger: ["blur", "input"],
    },
  }

  async function initTicketById(id: string | string[]) {
    loading.value = true
    try {
      const response = await fetchTicketById(id)
      if (response.status === "error") {
        message.error(response.message || "Ошибка при загрузке заявок")
        return
      }
      // Извлекаем только нужные поля для формы
      const ticket = response.payload
      formValue.value = {
        status: ticket.status,
        criticality: ticket.criticality,
        ticket_number: ticket.ticket_number || "",
        submitted_at: ticket.submitted_at,
        technical_tasks_preview: ticket.technical_tasks_preview, // Используем оригинальный массив строк
        technical_tasks_details: ticket.technical_tasks_details,
        content: ticket.content,
      }
      ticketInfo.value = response.payload
    } catch (e) {
      console.error("Error in initTicketById:", e)
    } finally {
      loading.value = false
    }
  }

  async function updateTicket(ticket: TicketUpdatePayload, ticketId: number) {
    loading.value = true
    try {
      const response = await updateTicketById(ticketId, ticket)
      if (response.status === "error") {
        message.error(response.message || "Ошибка при обновлении заявки")
        return
      }
      message.success("Заявка успешно обновлена")
      ticketInfo.value = { ...response.payload }
    } catch (e) {
      message.error("Ошибка при обновлении заявки")
      console.error("Error in updateTicket:", e)
    } finally {
      loading.value = false
      await router.push({ name: "Tickets" })
    }
  }
  async function createTicket(ticket: TicketCreatePayload) {
    loading.value = true
    try {
      const response = await createTicketReq(ticket)
      if (response.status === "error") {
        message.error(response.message || "Ошибка при cоздании заявки")
        return
      }
      message.success("Заявка успешно создана")
      ticketInfo.value = { ...response.payload }
      await router.push({ name: "Tickets" })
    } catch (e) {
      console.error("Error in updateTicket:", e)
      message.error("Ошибка при создании заявки")
    } finally {
      loading.value = false
    }
  }

  return {
    ticketInfo,
    formValue,
    rules,
    loading,
    createTicket,
    updateTicket,
    initTicketById,
  }
}
