import Stripe from 'stripe'
export class StripeServicio {
  constructor ({ stripeClaveSecreta = process.env.STRIPE_KEY }) {
    this.stripe = new Stripe(stripeClaveSecreta)
  }

  crearSessionCheckout = async (venta, successUrl, cancelUrl) => {
    try {
    // Calcular el precio con descuento distribuido
      const subtotal = parseFloat(venta.subtotal)
      const descuento = parseFloat(venta.descuento)
      const factorDescuento = 1 - (descuento / subtotal)

      const lineItems = venta.detalles.map(detalle => {
        const precioConDescuento = parseFloat(detalle.precioUnitario) * factorDescuento

        return {
          price_data: {
            currency: 'bob',
            product_data: {
              name: `${detalle.variante.producto.nombre} - ${detalle.variante.talla} ${detalle.variante.color}`,
              description: `${detalle.variante.producto.marca} - ${detalle.variante.producto.modelo}`,
              metadata: {
                precio_original: detalle.precioUnitario,
                descuento_aplicado: (parseFloat(detalle.precioUnitario) - precioConDescuento).toFixed(2)
              }
            },
            unit_amount: Math.round(precioConDescuento * 100) // Precio ya con descuento
          },
          quantity: detalle.cantidad
        }
      })

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          venta_id: venta.id.toString(),
          nro_factura: venta.nroFactura,
          cliente_email: venta.cliente.contacto,
          descuento_total: venta.descuento
        },
        customer_email: venta.cliente.contacto,
        client_reference_id: venta.id.toString()
      })

      return session
    } catch (error) {
      throw new Error(`Error creando session de Stripe: ${error.message}`)
    }
  }

  // Verificar pago completado
  verificarPago = async (sessionId) => {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent']
      })
      return session
    } catch (error) {
      throw new Error(`Error verificando pago: ${error.message}`)
    }
  }
}
