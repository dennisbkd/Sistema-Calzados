import { raw, Router } from 'express'
import { VentaControlador } from '../controller/paquete-G-Venta/gestion-Venta/venta.js'

// webhooks/stripeWebhook.js
export const crearStripeWebhook = ({ ventaServicio, stripeServicio }) => {
  const router = Router()

  const ventaControlador = new VentaControlador({ ventaServicio, stripeServicio })

  // Webhook con raw body
  router.post('/stripe-webhook',
    raw({ type: 'application/json' }),
    ventaControlador.webhookStripe
  )

  return router
}
