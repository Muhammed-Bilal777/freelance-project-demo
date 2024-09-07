import catchAsync from "../middlewares/catchAsync.js";
 
 

import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
 
// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsync(
  async (req, res, next) => {
    const body = req?.body;
     
     
    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1PtD4C07p2E1Du0s2z5Yk94H"],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    const shipping_rate =
      body?.itemsPrice >= 200
        ? "shr_1PwBp607p2E1Du0s18F97uBE"
        : "shr_1PtCtS07p2E1Du0s0MvWuvyf";

      try {
        const session = await stripe.checkout.sessions.create({
       
          payment_method_types: ["card"],
          success_url: `${process.env.FRONTEND_URL}/me/orders`,
          cancel_url: `${process.env.FRONTEND_URL}`,
          customer_email: req?.user?.email,
          client_reference_id: req?.user?._id?.toString(),
          mode: "payment",
          metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
          shipping_options: [
            {
              shipping_rate,
            },
          ],
          line_items,
        });

         
    res.status(200).json({
      url: session.url,
    });
      } catch (error) {
        console.log(error);
        
      }
     
   
    
   
  }
);
 