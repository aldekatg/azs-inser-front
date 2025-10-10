import { h } from "vue"
import { NButton, NIcon, NPopconfirm } from "naive-ui"
import { SortedFieldsType } from "@/types.ts"
import {
  StatusType,
  TicketCriticality,
  TicketSource,
  TicketStatusDictionary,
} from "@/utils/types.ts"

export function ActionButtons(buttons: any[]) {
  return buttons.map((button: any, _: number) => {
    if (button.type === "error") {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => button.onClick(),
        },
        {
          default: () => button.popconfirmText || "Вы уверены?",
          trigger: () =>
            h(
              NButton,
              {
                strong: true,
                secondary: true,
                circle: true,
                type: button.type,
              },
              {
                icon: () => h(NIcon, {}, { default: () => h(button.icon) }),
              }
            ),
        }
      )
    }

    return h(
      NButton,
      {
        strong: true,
        secondary: true,
        circle: true,
        type: button.type,
        onClick: () => button.onClick(),
      },
      {
        icon: () => h(NIcon, null, { default: () => h(button.icon) }),
      }
    )
  })
}

export const handleUpdateSorter = (
  sorter: { columnKey: string; sorter: string; order: string | null },
  initFunction: (sortedFields: SortedFieldsType) => void,
  sortedFields: SortedFieldsType
) => {
  if (sorter.order) {
    sortedFields.order_by = sorter.sorter
    sortedFields.desc = sorter.order === "descend"
  } else {
    sortedFields.order_by = "id"
    sortedFields.desc = false
  }
  initFunction(sortedFields)
}

// Конвертация UTC в UTC+5 и форматирование
const UTC_OFFSET = 5 * 60 * 60 * 1000 // UTC+5 в миллисекундах

function toUTC5(date: Date): Date {
  return new Date(date.getTime() + UTC_OFFSET)
}

function pad(num: number): string {
  return num.toString().padStart(2, "0")
}

// DD.MM.YYYY (UTC+5)
export function dateStr(date: string): string {
  if (!date) return "..."

  try {
    const utcDate = new Date(date)
    const utc5Date = toUTC5(utcDate)

    const day = pad(utc5Date.getUTCDate())
    const month = pad(utc5Date.getUTCMonth() + 1)
    const year = utc5Date.getUTCFullYear()

    return `${day}.${month}.${year}`
  } catch {
    return "..."
  }
}

// DD.MM.YYYY HH:MM (UTC+5)
export function dateTime(date: string): string {
  if (!date) return "..."

  try {
    const utcDate = new Date(date)
    const utc5Date = toUTC5(utcDate)

    const day = pad(utc5Date.getUTCDate())
    const month = pad(utc5Date.getUTCMonth() + 1)
    const year = utc5Date.getUTCFullYear()
    const hours = pad(utc5Date.getUTCHours())
    const minutes = pad(utc5Date.getUTCMinutes())

    return `${day}.${month}.${year} ${hours}:${minutes}`
  } catch {
    return "..."
  }
}

export const criticalityOptions = Object.entries(TicketCriticality).map(
  ([_, value]) => ({
    label: TicketStatusDictionary.TicketCriticality[value],
    value,
  })
)
export const statusOptions = Object.entries(StatusType).map(([_, value]) => ({
  label: TicketStatusDictionary.StatusType[value],
  value,
}))

export const statusSource = Object.entries(TicketSource).map(([_, value]) => ({
  label: TicketStatusDictionary.TicketSource[value],
  value,
}))
