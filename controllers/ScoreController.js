const Score = require("../models/Score");
const Joi = require("joi");

const getScore = (req, res) => {
  Score.find()
    .exec()
    .then(score => {
      res.json(score[0]);
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
  const {count, id} = req.body;
  if(!count) {
    return res.status(422).send({
      message: 'Count is required',
    });
  }
  console.log(Score)
  await Score.findOneAndUpdate({ _id: id }, req.body);

  res.status(200).send({
    status: "success",
    count,
    _id: id 
  });
};


module.exports = { getScore, setScore, updateScore };
