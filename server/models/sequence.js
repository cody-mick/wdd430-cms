const mongoose = require("mongoose");

const sequenceSchema = mongoose.Schema({
  value: { type: Number },
});

module.exports = mongoose.model("Sequence", sequenceSchema);
