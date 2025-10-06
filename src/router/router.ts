import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { requireAuth, shouldBeNotAuthorized } from "@/router/guards.ts"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/auth",
    name: "Authorized",
    component: () => import("@/views/auth/Auth.vue"),
    beforeEnter: [shouldBeNotAuthorized],
  },
  {
    path: "",
    name: "Home",
    component: () => import("@/views/Main.vue"),
    beforeEnter: [requireAuth],
    redirect: "/tickets",
    children: [
      {
        path: "/tickets",
        name: "Tickets",
        component: () => import("@/components/common/tickets/Tickets.vue"),
      },
      {
        path: "/tickets/create",
        name: "TicketCreate",
        component: () =>
          import("@/components/common/tickets/ticket-details/TicketCreate.vue"),
      },
      {
        path: "/tickets/:id(\\d+)",
        name: "TicketEdit",
        component: () =>
          import("@/components/common/tickets/ticket-details/TicketEdit.vue"),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
