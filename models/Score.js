const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Score = new Schema({
  count: {
    type: Number,
  },
});

module.exports = mongoose.model("score", Score);
