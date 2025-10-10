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
      required: false,
      message: "Номер заявки должен быть строкой",
      trigger: ["blur", "input"],
    },
    status: {
      required: true,
      message: "Статус обязателен",
      trigger: ["blur", "input"],
      validator: (_rule: any, value: string) => {
        if (!value || value === "") {
          return new Error("Выберите статус")
        }
        return true
      },
    },
    criticality: {
      required: true,
      message: "Критичность обязательна",
      trigger: ["blur", "input"],
      validator: (_rule: any, value: string) => {
        if (!value || value === "") {
          return new Error("Выберите критичность")
        }
        return true
      },
    },
    submitted_at: {
      required: true,
      message: "Дата подачи обязательна",
      trigger: ["blur", "change"],
    },
    content: {
      required: true,
      message: "Содержимое заявки обязательно",
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
      message.error("Ошибка при загрузке заявки")
      // eslint-disable-next-line no-console
      console.error("Error in initTicketById:", e)
    } finally {
      loading.value = false
    }
  }

  async function updateTicket(ticket: TicketUpdatePayload, ticketId: number) {
    loading.value = true
    try {
      ticket.technical_tasks_details = undefined as any
      ticket.technical_tasks_preview = undefined as any
      const response = await updateTicketById(ticketId, ticket)
      if (response.status === "error") {
        message.error(response.message || "Ошибка при обновлении заявки")
        return
      }
      message.success("Заявка успешно обновлена")
      ticketInfo.value = { ...response.payload }
      await router.push({ name: "Tickets" })
    } catch (e) {
      const errorMessage =
        (e as any).response?.data?.message || "Ошибка при обновлении заявки"
      message.error(errorMessage)
      // eslint-disable-next-line no-console
      console.error("Error in updateTicket:", e)
    } finally {
      loading.value = false
    }
  }
  async function createTicket(ticket: TicketCreatePayload) {
    loading.value = true
    try {
      ticket.technical_tasks_details = undefined as any
      ticket.technical_tasks_preview = undefined as any
      const response = await createTicketReq(ticket)
      if (response.status === "error") {
        message.error(response.message || "Ошибка при cоздании заявки")
        return
      }
      message.success("Заявка успешно создана")
      ticketInfo.value = { ...response.payload }
      await router.push({ name: "Tickets" })
    } catch (e) {
      const errorMessage =
        (e as any).response?.data?.message || "Ошибка при создании заявки"
      message.error(errorMessage)
      // eslint-disable-next-line no-console
      console.error("Error in createTicket:", e)
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
