const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const createSession = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data:{
                    product_data: {
                        name: "Plan Premium",
                        description: "Servicio Premium de atencion al cliente",
                    },
                    currency: "usd",
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "http://localhost:3001/success",
        cancel_url: "http://localhost:3001/cancel",
    });
    return res.json(session)
};
module.exports = { createSession };