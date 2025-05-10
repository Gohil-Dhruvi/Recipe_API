const Recipe = require('../model/recipe.model');

// Create
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title & description required' });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      author: req.user._id,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error creating recipe', error: err.message });
  }
};

// Get All
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err.message });
  }
};

// Get by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipe', error: err.message });
  }
};

// Get only mine
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your recipes', error: err.message });
  }
};

// Update
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // only author or admin
    if (!recipe.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
  }
};

// Delete
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (!recipe.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipe', error: err.message });
  }
};
