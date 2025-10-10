import { PaginationType } from "@/types.ts"

// Локальные типы для тикетов
export interface EmployeeResponse {
  id: number
  name: string
  email?: string
  warehouse?: {
    guid: string
  }
}

export interface GasStationType {
  id: number
  name: string
  address?: string
  object_number?: string
  operator_name?: string
}

export interface WorkType {
  id: number
  code: string
  description: string
  technical_task_id: number
}

export interface ChecklistType {
  id: number
  technical_task_id: number
  description: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: number
  name: string
  completed?: boolean
}

export interface TicketsResponse extends PaginationType {
  items: TicketDetails[]
}

export interface TicketDetails {
  gas_station_id: number
  status: string
  criticality: string
  ticket_type: string
  ticket_number: string | null
  submitted_at: string
  technical_tasks_preview: string[]
  technical_tasks_details: TechnicalTaskDetail[]
  content: string
  employee_id: number
  materials: Record<string, any>
  id: number
  guid: string
  comment: string
  service_sheet_number: number | null
  diagnostic_result: string
  created_at: string
  updated_at: string
  planned_finish_at: string
  closed_at: string
  work_started_at: string
  work_finished_at: string
  work_result: string
  gas_station: GasStationType
  employee: EmployeeResponse
  status_changed_at: string
  approval_wait_started_at: string
  approval_wait_total_seconds: number
  closed_via_qr_at: string
  escalation_timeout_minutes: number
  escalation_due_at: string
  is_sla_80_elapsed?: boolean
}

export interface TicketCreatePayload {
  status: string
  criticality: string
  ticket_type: string
  ticket_number: string | null
  submitted_at: string | number | Date
  technical_tasks_preview: string[]
  technical_tasks_details: TechnicalTaskDetail[]
  content: string
}

export interface TicketUpdatePayload {
  status: string
  criticality: string
  ticket_number: string
  submitted_at: string
  technical_tasks_preview: string[]
  technical_tasks_details: TechnicalTaskDetail[]
  content: string
}

export interface TechnicalTaskDetail {
  code: string
  equipment: string
  description: string
  id: number
  work_types: WorkType[]
  checklists: ChecklistType[]
}

export interface MaterialResponse {
  nomenclature_name: string
  nomenclature_guid: string
  quantity: number
}
