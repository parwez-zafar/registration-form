const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true,
        unique: true
    },
    Age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//   Generating tokens
employeeSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        // console.log("token is " + token);
        // await this.save();
        return token;
    } catch (error) {
        res.send("The error part" + error);
        consol.log("The error part" + error);
    }
}
// Code for hashing password
employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
        console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
        // console.log(`The current password is ${this.password}`);

        this.confirmPassword = undefined;// this will not be stored confirm password
    }
    next();
})

// now we need to create collection 

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
