const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Task = new Schema({
   
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "NOT_STARTED" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },

    



  });



  module.exports = mongoose.model("Task", Task);
  