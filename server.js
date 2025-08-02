const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || "postgresql://recipes_ed7t_user:bCLggzq2fIafrBUuSuTmzBRsyqq8gasB@dpg-d26raivdiees73au6ubg-a.singapore-postgres.render.com/recipes_ed7t", {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {  
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false 
});

// Recipe model
const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  making_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serves: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cost: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Routes

// POST /recipes - Create a new recipe
app.post('/recipes', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;
  
  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    });
  }

  try {
    const recipe = await Recipe.create({
      title,
      making_time,
      serves,
      ingredients,
      cost
    });

    res.status(200).json({
      message: "Recipe successfully created!",
      recipe: [{
        id: recipe.id,
        title: recipe.title,
        making_time: recipe.making_time,
        serves: recipe.serves,
        ingredients: recipe.ingredients,
        cost: recipe.cost,
        created_at: recipe.created_at,
        updated_at: recipe.updated_at
      }]
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe" });
  }
});

// GET /recipes - Get all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ['id', 'title', 'making_time', 'serves', 'ingredients', 'cost']
    });

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});



// GET /recipes/:id - Get a specific recipe
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      attributes: ['id', 'title', 'making_time', 'serves', 'ingredients', 'cost']
    });

    if (!recipe) {
      return res.status(200).json({ message: "No recipe found" });
    }

    res.status(200).json({
      message: "Recipe details by id",
      recipe: [recipe]
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
});

// PATCH /recipes/:id - Update a recipe
app.patch('/recipes/:id', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(200).json({ message: "No recipe found" });
    }

    await recipe.update({
      title: title || recipe.title,
      making_time: making_time || recipe.making_time,
      serves: serves || recipe.serves,
      ingredients: ingredients || recipe.ingredients,
      cost: cost || recipe.cost
    });

    res.status(200).json({
      message: "Recipe successfully updated!",
      recipe: [{
        title: recipe.title,
        making_time: recipe.making_time,
        serves: recipe.serves,
        ingredients: recipe.ingredients,
        cost: recipe.cost
      }]
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe" });
  }
});

// DELETE /recipes/:id - Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(200).json({ message: "No recipe found" });
    }

    await recipe.destroy();
    res.status(200).json({ message: "Recipe successfully removed!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

// 404 for all other routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Database sync and server start
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});