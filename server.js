const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());

/* const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount

  // Calculate the order total on the server to prevent

  // people from directly manipulating the amount on the client
  return 1400;
}; */

app.post("/create-payment-intent", async (req, res) => {
  //const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const { currency, paymentMethodType } = req.body;

  try {
    const result = await stripe.paymentIntents.create({
      //amount: calculateOrderAmount(items),
      amount: 100,
      currency: currency,
      payment_method_types: [paymentMethodType],
    });
    /*   res.send({
    clientSecret: paymentIntent.client_secret,
  }); */
    console.log(result);
    res.json({
      clientSecret: result.client_secret,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
});

app.listen(5000, () => {
  console.log("Server on port 5000");
});
