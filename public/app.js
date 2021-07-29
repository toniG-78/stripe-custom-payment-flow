let clientName = document.querySelector("#name").value;
let clienEmail = document.querySelector("#email").value;
console.log(clienEmail, clientName);
document.querySelector("#btnPay").disabled = true;

const stripe = Stripe(
  "pk_test_51JHn2qJtmo9lR2RjshQyzb2DeggQg6ykF7x12EMQT2kgoe1xkiMVVWN1dv3BEoBhnsjyttwR9YHxRNiYoqWV8e6R003qe794K4"
);

const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");
card.on("change", function (event) {
  // Disable the Pay button if there are no card details in the Element
  document.querySelector("#btnPay").disabled = event.empty;
  /*   document.querySelector("#card-error").textContent = event.error
    //? event.error.message
    : ""; */
});

document.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Fetch to server and get the client secret ********************
  /* const { error: backendError, clientSecret } = await initializedPayment(); */
  let clientSecret = await initializedPayment();
  console.log(clientSecret);

  // Stripe Confirm client secret and payment **************************
  //TODO: create a function and await the payment intent id
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        //Todo: add other methods
        billing_details: {
          name: clientName,
          email: clienEmail,
        },
      },
    })
    .then(function (result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        console.log(result);
        orderComplete(result.paymentIntent.id);
      }
    });
});

// Fetch to server and get the client secret ********************
function initializedPayment() {
  return fetch("/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethodType: "card",
      currency: "eur",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //console.log(data);
      return data.clientSecret;
    })
    .catch((err) => console.error(err.message));
}

//Handlers ******************************************************************************
function orderComplete(paymentIntentId) {
  //loading(false);
  document
    .querySelector(".message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".message").classList.remove("hidden");
  document.querySelector("#btnPay").disabled = true;
}

// Show the customer the error from Stripe if their card fails to charge
function showError(errorMsgText) {
  //loading(false);
  var errorMsg = document.querySelector("#card-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function () {
    errorMsg.textContent = "";
  }, 4000);
}
