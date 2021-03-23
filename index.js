const express = require("express");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is the root");
});

app.post("/api/send-mail", async (req, res) => {
  // getting body of the post call
  const userDetails = req.body;

  // doing type check
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    "date-from": Joi.string().required(),
    "date-to": Joi.string().required(),
    "room-type": Joi.string().required(),
    "room-requirements": Joi.string().required(),
    adults: Joi.number().required(),
    children: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    "special-requirements": Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send({error: true, message: result.error.details[0].message});
    return;
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "patliputrahotels.booking@gmail.com",
      pass: "exortica",
    },
  });

  // creating a HTML body fro the mail
  let myHTML = `<h2>Details of the person</h2>
  <p>Please contact following person in reference to the booking.</p>
  
  <table style="border-collapse: collapse;
  width: 100%;">
    <tr>
      <th style="padding: 15px; border: 1px solid #ddd;
      text-align: left;">Fields</th>
      <th style="padding: 15px; border: 1px solid #ddd;
      text-align: left;">Info</th>
    </tr>`;

  // going through all the keys of the object and adding in new data in the table
  for (const field in userDetails) {
    console.log(typeof userDetails[field]);
    myHTML += `<tr>
    <th style="padding: 15px; border: 1px solid #ddd;
    text-align: left;">${field.split("-").join(" ").toUpperCase()}</th>
    <th style="padding: 15px; border: 1px solid #ddd;
    text-align: left;">${userDetails[field]}</th>
  </tr>`;
  }

  myHTML += "</table>";

  const mailOptions = {
    from: "patliputrahotels.booking@gmail.com", // sender address
    to: [
      "amankumar4real@gmail.com",
      "amankumar3j@gmail.com",
      "soumya15d@gmail.com"
    ], // list of receivers
    subject: "Hotel Reservation Form", // Subject line
    html: myHTML, // html body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) res.status(500).send(err);
    else res.send({ error: false, message: "message delivered", info });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port !" + (process.env.PORT || 3000));
});
