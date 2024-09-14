const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "O ID do usuário é obrigatório."],
  },
  title: {
    type: String,
    required: [true, "O título é obrigatório."],
  },
  price: {
    type: Number,
    required: [true, "O valor é obrigatório."],
    min: [0, "O valor não pode ser negativo."],
  },
  transactionType: {
    type: String,
    enum: {
      values: ["entrada", "saida"],
      message: "O tipo de transação deve ser 'entrada' ou 'saida'.",
    },
    required: [true, "O tipo de transação é obrigatório."],
  },
  completed: {
    type: Boolean,
    default: false,
  },

  // //colocar no site
  // date: {
  //   type: Date,
  //   required: [true, "A data é obrigatória."],
  // },
});

module.exports = mongoose.models.Task || mongoose.model("Task", TaskSchema);
