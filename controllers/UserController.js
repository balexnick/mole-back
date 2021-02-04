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
  return Joi.validate(data, loginSchema, async (err, value) => {
    if (err) {
      const str = err.details[0].path[0]
      res.status(500).json({ message: `${validateMessage(str)} is required` });
      return null;
    }
    if (!validateEmail(email)) {
      res.status(500).json({ message: "Email must be valid" });
      return null
    }
    await User.find({ email }, async (err, user) => {
      const match = await bCrypt.compare(password, user[0].password);
      if (user.length === 0) {
        res
          .status(401)
          .json({ message: "User does not exist!" });
      } else if (match) {
        res.status(200).json({
          token: createToken({ id: user[0]._id }),
          id: user[0]._id,
          message: "Authenticated successfully"
        });
      } else {
        res
          .status(401)
          .json({ message: "Incorrect password" });
      }
    })
  });
};

const register = (req, res) => {
  const data = req.body;
  const { name, email, password } = req.body;
  return Joi.validate(data, registerSchema, async (err) => {
    
    if (err) {
      const str = err.details[0].path[0]
      res.status(500).json({ message: `${validateMessage(str)} is required` });
      return null
    }
  
    if (!validateEmail(email)) {
      res.status(500).json({ message: "Email must be valid"});
      return null
    }
    if(password.length < 6){
      res.status(500).json({ message: `Password no less than symbols` });
    }
    await User.find({ email }, (err, user) => {
      if (user.length !== 0) {
        return res
          .status(409)
          .json({ message: "User already exsist"});
      }
    });
      
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
  });
};

module.exports = { login, register };




