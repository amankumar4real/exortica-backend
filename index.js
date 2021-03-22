const express = require("express");
  const Joi = require("joi");
const nodemailer = require("nodemailer");
const cors = require("cors")

const app = express();
app.use(cors())
app.use(express.json());

const arr = [
  { id: 1, name: "abcd" },
  { id: 2, name: "xyz" },
];

app.get("/", (req, res) => {
  res.send("this is the rootO");
});

app.get("/api/array", (req, res) => {
  res.send(JSON.stringify([1, 2, 3, 4, 5]));
});

app.get("/api/student/:id", (req, res) => {
  const data = arr.find((a) => {
    return a.id == req.params.id;
  });

  console.log(data, req.params.id);

  if (data) {
    res.send("data is available");
  } else {
    res.status(400).send({ error: true, message: "Data not available!" });
  }
});

app.post("/api/student", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const dya = req.body.name;

  arr.push({ id: arr.length + 1, name: dya });

  res.send({
    error: false,
    newData: arr,
    message: "New data added to the arr!",
  });
});

app.post("/api/send-mail", async (req, res) => {
  
  // getting body of the post call
  const userDetails = req.body

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
    </tr>`

  for (const field in userDetails) {
    // console.log(field.split("-").join(" ").toUpperCase())
    myHTML += `<tr>
    <th style="padding: 15px; border: 1px solid #ddd;
    text-align: left;">${field.split("-").join(" ").toUpperCase()}</th>
    <th style="padding: 15px; border: 1px solid #ddd;
    text-align: left;">${userDetails[field]}</th>
  </tr>`
  }

  myHTML += "</table>"
  


  const mailOptions = {
    from: "patliputrahotels.booking@gmail.com", // sender address
    to: ["amankumar4real@gmail.com", "amankumar3j@gmail.com", "soumya15d@gmail.com"], // list of receivers
    subject: "Hotel Reservation Form", // Subject line
    html: myHTML, // html body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) res.status(500).send(err);
    else res.send(info);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port !" + (process.env.PORT || 3000));
});

// define('_EMAIL_TO', 'reservations@patliputraexotica.com');
// define('_EMAIL_SUBJECT', 'Hotel Reservation Form');
// define('_EMAIL_FROM', $_POST["email"]);
// Hipf@07.