require('dotenv').config();
const express = require('express');
const path = require("path");
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require("./db/connection");
const Register = require("./models/registers");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);



app.get("/", (req, res) => {
    res.render("index");
})
app.get("/login", (req, res) => {
    res.render("login");
})


app.get("/registration", (req, res) => {
    res.render("register");
})


// create a new user in our database
app.post("/registration", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password === confirmPassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                Phone: req.body.Phone,
                Age: req.body.Age,
                password: password,
                confirmPassword: confirmPassword,
            })
            // console.log("employee" + registerEmployee);
            // Password Hashing(using middleware)

            const token = await registerEmployee.generateAuthToken();
            console.log("appjs token is " + token);

            const registered = await registerEmployee.save();
            // console.log("registered is " + registered);

            res.status(201).render("index")
        }
        else {
            res.send("Passwords are not matching");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})
// loging cheaking code
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, userEmail.password)

        const token = await userEmail.generateAuthToken();
        console.log("login token is " + token);


        if (isMatch) {
            res.status(201).render("index")
        }
        else {
            res.send("Either email or passward is wrong")
        }

    } catch (error) {
        res.status(400).send("Either email or passward is wrong");
    }
})


app.listen(port, () => {
    console.log(`App is running http://localhost:${port}`)
})