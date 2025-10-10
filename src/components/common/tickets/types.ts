export interface RowData {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

export type MaterialItem = {
  nomenclature_name: string
  nomenclature_guid: string
  assignment_code: string
  quantity: number
}
export type TaskTab = { code: string; materials: MaterialItem[] }

export interface TicketFilters {
  ticket_type: "customer_call" | "planned" | string
  order_by: string
  desc: boolean
  limit: number
  skip: number
  // Опциональные фильтры
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
