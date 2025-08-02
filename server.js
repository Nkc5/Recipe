const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Load JSON data
const dataPath = path.join(__dirname, 'dummy.json');
let recipeData = JSON.parse(fs.readFileSync(dataPath));

// GET all recipes
app.get('/recipes', (req, res) => {
  res.json(recipeData);
});

// GET single recipe
app.get('/recipes/:id', (req, res) => {
  const recipe = recipeData.recipes.find(r => r.id === parseInt(req.params.id));
  res.json({ 
    message: "Recipe details by id", 
    recipe: recipe ? [recipe] : [] 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API serving JSON data on port ${PORT}`));