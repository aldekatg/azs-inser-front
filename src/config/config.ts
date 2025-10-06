const PROD_URL = import.meta.env.VITE_API_BASE
const PORT = import.meta.env.PORT
const FLEXIBLE_ADMISSION = import.meta.env.VITE_FLEXIBLE_ADMISSION
const QR_BASE_URL =
  import.meta.env.VITE_QR_BASE_URL || "http://188.127.40.237:5137"

export const config = {
  BACKEND_URL: PROD_URL,
  PORT: PORT,
  FLEXIBLE_ADMISSION: FLEXIBLE_ADMISSION,
  QR_BASE_URL: QR_BASE_URL,
}
