const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enums: ["Easy", "Difficult", "Intermediate"],
  },
  prepTime: {
    type: Number,
    required: true
  },
  cookTime: {
    type: Number,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  instrunctions: {
    type: [String],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
},{
  timestamps: true
})

const recipe = mongoose.model("recipes", recipeSchema)

module.exports = recipe