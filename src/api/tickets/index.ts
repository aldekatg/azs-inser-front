import { Response, SortedFieldsType } from "@/types.ts"
import { api, objectToUrlParams } from "@/api"
import {
  TicketCreatePayload,
  TicketDetails,
  TicketsResponse,
  TicketUpdatePayload,
} from "@/api/tickets/types.ts"

const URLS = {
  getTickets: "/gs/tickets",
}

// Tickets
export const fetchTickets = async (sortedFields: SortedFieldsType) =>
  api
    .get<
      Response<TicketsResponse>
    >(URLS.getTickets + objectToUrlParams(sortedFields))
    .then((resp) => resp.data)

export const fetchTicketById = async (id: string | string[]) =>
  api
    .get<Response<TicketDetails>>(`${URLS.getTickets}/${id}`)
    .then((resp) => resp.data)

export const updateTicketById = async (id: number, body: TicketUpdatePayload) =>
  api
    .patch<Response<TicketDetails>>(`${URLS.getTickets}/${id}`, body)
    .then((resp) => resp.data)

export const createTicketReq = async (body: TicketCreatePayload) =>
  api
    .post<Response<TicketDetails>>(URLS.getTickets, body)
    .then((resp) => resp.data)
