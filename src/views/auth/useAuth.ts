import { ref } from "vue"
import type { FormInst } from "naive-ui"
import { useAuthStore } from "@/store/useAuthStore.ts"
import { login } from "@/api/auth"
import { useRouter } from "vue-router"

// Простая регулярка для email
const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const { initAuth } = useAuthStore()

export const useAuth = () => {
  const message = useMessage()
  const router = useRouter()
  const formRef = ref<FormInst | null>(null)
  const formValue = ref({
    mail: "",
    password: "",
  })
  const loading = ref<boolean>(false)

  const rules = {
    mail: {
      required: true,
      type: "email",
      message: "Email обязателен",
      validator(_: unknown, value: string) {
        console.log(_)
        if (value && !regEmail.test(value)) {
          return new Error("Введите верный формат email")
        }
      },
      trigger: ["blur", "input"],
    },
    password: {
      required: true,
      message: "Введите пароль!",
    },
  }

  const loginHandler = async (email: string, password: string) => {
    loading.value = true
    console.log(email, password)
    try {
      const response = await login(email, password)

      if (!response || response.status === "error") {
        throw new Error("No access token in response")
      }

      initAuth(response.payload.access_token, response.payload.refresh_token)
      message.success("Вы успешно авторизованы!")

      // Проверяем наличие pending QR GUID
      const pendingQRGuid = sessionStorage.getItem("pendingQRGuid")
      if (pendingQRGuid) {
        sessionStorage.removeItem("pendingQRGuid")
        await router.push(`/confirmQR?guid=${pendingQRGuid}`)
      } else {
        await router.push("/")
      }
    } catch (error) {
      message.error("Ошибка авторизации! Проверьте почту и пароль.")
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loginHandler,
    rules,
    formRef,
    formValue,
    loading,
  }
}
