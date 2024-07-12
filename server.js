const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cors = require('cors')

const app = express();
const port = 8008;

//middleware
app.use(cors()); //Eneble CORS for all origins(for production not recommended)
app.use(bodyParser.urlencoded({ extended: true })); //this is i used for decode the data send through html form


// Twilio credentials
const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);


//* sms end point
app.post('/send-sms', (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  client.messages
    .create({
      body: 'Your appointment is booked. We will contact you shortly.',
      from: '+19124612414', // Your Twilio number
      to: phoneNumber
    })
    .then(message => {
      console.log(message.sid);
      res.send('SMS sent successfully');
    })
    .catch(error => {
      console.error(error);
      res.send('Failed to send SMS');
    });
});



//* email end point

// Configure the email transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: '', // replace with your email
		pass: '',  // replace with your email password
	},
});

app.post('/subscribe', (req, res) => {
	const { email, message } = req.body;
	console.log(`Email: ${email}, Message: ${message}`);

	// Email to user
	const userMailOptions = {
		from: 'your-email@gmail.com',
		to: email,
		subject: 'Subscription to Sunday Newsletter',
		text: `Hey! I like your interest in our Sunday newsletter. Thanks for your interest! Truly yours!`,
	};

	// Email to organization
	const orgMailOptions = {
		from: 'your-email@gmail.com',
		to: 'dksinha0701@gmail.com', // replace with your organization's email
		subject: 'New Newsletter Subscription',
		text: `A user is interested in our email and their email address is ${email}. Message: ${message}`,
	};

	// Send email to user
	transporter.sendMail(userMailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email to user:', error);
			res.status(500).send('Error subscribing to newsletter.');
		} else {
			console.log('Email sent to user:', info.response);

			// Send email to organization
			transporter.sendMail(orgMailOptions, (error, info) => {
				if (error) {
					console.error('Error sending email to organization:', error);
					res.status(500).send('Error subscribing to newsletter.');
				} else {
					console.log('Email sent to organization:', info.response);
					res.send('Subscription successful!');
				}
			});
		}
	});
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
