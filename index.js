const {initializeDatabase} = require("./db/db.connect")
const Recipes = require("./models/recipe.models")
const express = require("express")
const app = express()
app.use(express.json())
initializeDatabase()
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.get("/", (req, res) => {
  res.send("Hello, express server")
})

async function createRecipe(newRecipe){
  try{
    const recipe = new Recipes(newRecipe)
    const saveRecipe = await recipe.save()
    return(saveRecipe)
  }catch(error){
    throw error
  }
}

app.post("/recipes", async (req, res) => {
  try{
   const recipe = await createRecipe(req.body)
   res.status(200).json({message: "Recipe added successfully." })
  }catch(error){
    res.status(500).json({error : "Failed to add recipe."})
  }
})

async function readAllRecipes(){
  try{
    const recipes = await Recipes.find()
    return(recipes)
  }catch(error){
    throw error
  }
}

app.get("/recipes", async (req, res) => {
  try{
   const recipes = await readAllRecipes()
   if(recipes.length != 0){
    res.json(recipes)
   }else{
    res.status(404).json({error: "Recipes not found."})
   }
  }catch(error){
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})

async function readRecipesByTitle(recipeTitle){
  try{
    const recipesByTitle = await Recipes.find({title: recipeTitle})
    return(recipesByTitle)
  }catch(error){
    throw error
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try{
    const recipe = await readRecipesByTitle(req.params.recipeTitle)
    if(recipe){
      res.json(recipe)
    }else{
      res.status(404).json({error: "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch recipe."})
  }
})


async function readRecipesByAuthor(recipeAuthor){
  try{
    const recipesByAuthor = await Recipes.find({author: recipeAuthor})
    return(recipesByAuthor)
  }catch(error){
    throw error
  }
}

app.get("/recipes/author/:recipeAuthor", async (req, res) => {
  try{
    const recipes = await readRecipesByAuthor(req.params.recipeAuthor)
    if(recipes.length != 0){
      res.json(recipes)
    }else{
      res.status(404).json({error : "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})

async function readRecipesByDifficultyLevel(difficultyLevel){
  try{
    const recipesByDifficultyLevel = await Recipes.find({difficulty : difficultyLevel})
    return(recipesByDifficultyLevel)
  }catch(error){
    throw error
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try{
    const recipes = await readRecipesByDifficultyLevel(req.params.difficultyLevel)
    if(recipes.length != 0){
      res.json(recipes)
    }else{
      res.status(404).json({error: "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch recipes."})
  }
})


async function updateRecipeById(recipeId, dataToUpdate){
  try{
     const updateRecipe = await Recipes.findByIdAndUpdate(recipeId, dataToUpdate , {new : true})
     console.log(updateRecipe)
     return(updateRecipe)
  }catch(error){
    throw error
  }
}


app.post("/recipes/:recipeId", async (req, res) => {
  try{
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body)
    if(updatedRecipe){
      res.status(200).json({message: "Recipe updated successfully.", recipe : updatedRecipe} )
    }else{
      res.status(404).json({error: "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to update recipe."})
  }
} )

async function updateRecipeByTitle(reciptTitle, dataToUpdate){
  try{
    const updateRecipe = await Recipes.findOneAndUpdate({title: reciptTitle}, dataToUpdate, {new: true})
    return(updateRecipe)
  }catch(error){
    throw error
  }
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try{
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle , req.body)
    if(updatedRecipe){
      res.status(200).json({message: "Recipe updated successfully." , recipe: updatedRecipe} )
    }else{
      res.status(404).json({error: "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to update recipe."})
  }
})

async function deleteRecipeById(recipeId){
  try{
    const deleteRecipe = await Recipes.findByIdAndDelete(recipeId)
    return(deleteRecipe)
  }catch(error){
    throw error
  }
}

app.delete("/recipes/:recipeId", async (req , res) => {
  try{
    const deletedRecipe = await deleteRecipeById(req.params.recipeId)
    if(deletedRecipe){
      res.status(200).json({message: "Recipe deleted successfully." , recipe: deletedRecipe} )
    }else{
      res.status(404).json({error: "Recipe not found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to delete recipe."})
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
