import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

let stripe;

const initializeStripe = async () => {
  stripe = await loadStripe(
    'pk_test_51Po0wZDiIroMlxtKrKdFclYAnKp0QP5Q8xs624je2BuWTsuKj28ci4TYP1Coz4OvxCfv5flx0CpRLn9wxYmAf1M500QSOD7pNz',
  );
};

initializeStripe(); // Initialize Stripe on load

export const bookTour = async (tourID) => {
  try {
    // Wait for Stripe to be initialized if it's not ready
    if (!stripe) {
      await initializeStripe();
    }

    // 1) Get the session from the server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourID}`,
    );

    // 2) Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', 'Something went wrong, please try again!');
  }
};
