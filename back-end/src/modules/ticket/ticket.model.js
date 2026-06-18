const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Pending", "In Progress", "Resolved", "Closed"],
    default:"Open"
  },
  priority: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5],
    default: 5,
  },
  department: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref:"users",
    required: true,
  },
  tags: {
    type: [String],
  },
},
  {
    timestamps: true
  })

const model=mongoose.model("tickets",schema);

module.exports=model