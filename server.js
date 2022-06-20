require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

let baseUrl;

if (process.env.NODE_ENV === 'production') {
	baseUrl = 'https://sample-stripe-app-5986.herokuapp.com/';
} else {
	baseUrl = 'http://localhost:3000';
}


app.post('/create-checkout-session', async (req, res) => {

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: process.env.STRIPE_PRODUCT_PRICE_ID,
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `${baseUrl}/success.html`,
		cancel_url: `${baseUrl}/cancel.html`
	});

	res.redirect(303, session.url);

})

app.listen(process.env.PORT || 3000, () => {
	console.log('Server is running');
});
