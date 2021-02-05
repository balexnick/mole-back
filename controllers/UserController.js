const User = require("../models/User");
const createToken = require("../utils/jwtToken").createToken;
const Joi = require("joi");
const bCrypt = require("bcrypt");
const validateEmail = require("../utils/authValidation").validateEmail;
const validateMessage = require("../utils/authValidation").validateMessage;

const registerSchema = {
  name: Joi.string().required(),
  email: Joi.string()
    .required(),
  password: Joi.string()
    .required()
    .min(6)
};

const loginSchema = {
  email: Joi.string().required(),
  password: Joi.string().required()
};

const login = (req, res) => {
  const data = req.body;
  const { email, password } = req.body;
  Joi.validate(data, loginSchema, async (err, value) => {
    if (err) {
      const str = err.details[0].path[0]
      res.status(422).json({ message: `${validateMessage(str)} is required` });
      return null;
    }
    if (!validateEmail(email)) {
      res.status(422).json({ message: "Email must be valid" });
      return null
    }

    await User.find({ email }, async (err, user) => {
      if (user.length === 0) {
        return res
          .status(422)
          .send({ message: "User does not exist!" });
      } 
      let test = bCrypt.compare(password, user[0].password)
      if (test) {
        return res.status(200).send({
          token: createToken({ id: user[0]._id }),
          id: user[0]._id,
          message: "Authenticated successfully"
        });
      } 
      return res
        .status(422)
        .send({ message: "Incorrect password" });
    })
  });
};

const register = (req, res) => {
  const data = req.body;
  const { name, email, password } = req.body;
  Joi.validate(data, registerSchema, async (err) => {
    if(password.length < 6){
      res.status(500).json({ message: `Password no less than symbols` });
    }
    if (err) {
      const str = err.details[0].path[0]
      res.status(500).json({ message: `${validateMessage(str)} is required` });
      return null
    }

  
    if (!validateEmail(email)) {
      res.status(500).json({ message: "Email must be valid"});
      return null
    }
    let check = false;
    await User.find({ email }, (err, user) => {
      if (user.length !== 0) {
        check = true;
      }
    });
      
    if(check){
      return res
      .status(409)
      .json({ message: "User already exsist"});
    }else{
      let salt = bCrypt.genSaltSync(5);
      let hash = bCrypt.hashSync(password, salt)
      const newUser = new User({
        name,
        email,
        password: hash
      });
      await newUser.save();
      return res.status(200).json({
        auth: "success",
        token: createToken({ id: newUser.id }),
        id: newUser.id,
        message: "Successful registration"
      });
    }
  });
};

module.exports = { login, register };




