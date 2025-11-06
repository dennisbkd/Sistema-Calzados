import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeService {
  async crearPagoStripe({ monto, descripcion }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(monto * 100),
        currency: "usd",
        description: descripcion || "Pago en sistema de Calzados"
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret
      };
    } catch (err) {
      console.error("Error Stripe:", err);
      return { success: false, error: err.message };
    }
  }
}
