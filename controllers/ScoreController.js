const Score = require("../models/Score");
const Joi = require("joi");

const getScore = (req, res) => {
  Score.find()
    .exec()
    .then(tasks => {
      res.json(tasks);
    });
};

const setScore = async (req, res) => {
  const { count } = req.body;
  if(!count) {
    return res.status(422).send({
      message: 'Count is required',
    });
  }
  await Score.create({count});
  return res.status(200).send({
    status: "success",
  });
};

const updateScore = async (req, res) => {
  const {count} = req.body;
  if(!count) {
    return res.status(422).send({
      message: 'Count is required',
    });
  }
  await Score.findOneAndUpdate({ _id: req.params.id }, count);
  res.status(200).json({
    status: "success",
    count
  });
};


module.exports = { getScore, setScore, updateScore };
