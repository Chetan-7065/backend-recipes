const {initializeDatabase} = require("./db/db.connect")
const Recipes = require("./models/recipe.models")
const express = require("express")
const app = express()
app.use(express.json())
initializeDatabase()

app.get("/", (req, res) => {
  res.send("Hello, express server")
})

// {
//   "title": "Spaghetti Carbonara",
//   "author": "Sanjeev Kapoor",
//   "difficulty": "Intermediate",
//   "prepTime": 20,
//   "cookTime": 15,
//   "ingredients": [
//     "200g spaghetti",
//     "100g guanciale or pancetta, diced",
//     "2 large eggs",
//     "50g grated Pecorino Romano cheese",
//     "Salt and black pepper to taste"
//   ],
//   "instructions": [
//     "Cook the spaghetti in boiling salted water until al dente.",
//     "Meanwhile, sauté the guanciale or pancetta until crispy.",
//     "In a bowl, whisk together eggs and grated cheese.",
//     "Drain the spaghetti and immediately toss with the egg mixture and cooked guanciale/pancetta.",
//     "Season with salt and pepper. Serve immediately."
//   ],
//   "imageUrl": "https://example.com/spaghetti_carbonara.jpg"
// }

// {
//   "title": "Chicken Tikka Masala",
//   "author": "Sanjeev Kapoor",
//   "difficulty": "Intermediate",
//   "prepTime": 30,
//   "cookTime": 30,
//   "ingredients": [
//     "500g boneless, skinless chicken thighs, cut into bite-sized pieces",
//     "1 cup plain yogurt",
//     "2 tablespoons vegetable oil",
//     "2 onions, finely chopped",
//     "4 cloves garlic, minced",
//     "1-inch piece of ginger, grated",
//     "2 teaspoons ground coriander",
//     "1 teaspoon ground cumin",
//     "1 teaspoon paprika",
//     "1/2 teaspoon turmeric",
//     "1/2 teaspoon cayenne pepper (adjust to taste)",
//     "1 cup tomato puree",
//     "1 cup heavy cream",
//     "Salt and cilantro leaves for garnish"
//   ],
//   "instructions": [
//     "Marinate chicken pieces in yogurt and spices for at least 1 hour.",
//     "Heat oil in a pan and sauté onions, garlic, and ginger until golden.",
//     "Add marinated chicken and cook until browned.",
//     "Stir in tomato puree and cook until chicken is cooked through.",
//     "Add cream, season with salt, and simmer for a few minutes.",
//     "Garnish with cilantro leaves and serve with rice or naan."
//   ],
//   "imageUrl": "https://example.com/chicken_tikka_masala.jpg"
// }


// {
//   "title": "Classic Chocolate Chip Cookies",
//   "author": "Baker Betty",
//   "difficulty": "Easy",
//   "prepTime": 15,
//   "cookTime": 10,
//   "ingredients": [
//     "1 cup (2 sticks) unsalted butter, softened",
//     "3/4 cup granulated sugar",
//     "3/4 cup packed light brown sugar",
//     "1 teaspoon vanilla extract",
//     "2 large eggs",
//     "2 1/4 cups all-purpose flour",
//     "1 teaspoon baking soda",
//     "1/2 teaspoon salt",
//     "2 cups semisweet chocolate chips"
//   ],
//   "instructions": [
//     "Preheat the oven to 375°F (190°C). Line baking sheets with parchment paper.",
//     "In a large bowl, cream together the butter, granulated sugar, and brown sugar until smooth.",
//     "Beat in the vanilla extract and eggs one at a time until well blended.",
//     "Combine the flour, baking soda, and salt; gradually stir into the creamed mixture.",
//     "Stir in the chocolate chips by hand using a wooden spoon.",
//     "Drop by rounded spoonfuls onto the prepared baking sheets.",
//     "Bake for 8 to 10 minutes in the preheated oven, or until edges are golden.",
//     "Allow cookies to cool on baking sheet for 5 minutes before transferring to a wire rack to cool completely."
//   ],
//   "imageUrl": "https://example.com/classic_chocolate_chip_cookies.jpg"
// }
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