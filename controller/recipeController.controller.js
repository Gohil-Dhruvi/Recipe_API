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

// Search

exports.searchRecipes = async (req, res) => {
  try {
    // parse & default
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { q, tag } = req.query;

    // build filter
    const filter = {};
    if (q)   filter.title = { $regex: q, $options: 'i' };
    if (tag) filter.tags  = tag;

    // execute query
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('author', 'username');

    res.json({
      page,
      limit,
      count: recipes.length,
      recipes
    });
  } catch (err) {
    res.status(500).json({ message: 'Error searching recipes', error: err.message });
  }
};


// Get by tag
exports.getByTag = async (req, res) => {
  try {
    const recipes = await Recipe.find({ tags: req.params.tagName }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching by tag', error: err.message });
  }
};

// Get by category
exports.getByCategory = async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.categoryName }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching by category', error: err.message });
  }
};

// Like
exports.likeRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } });
    res.json({ message: 'Recipe liked' });
  } catch (err) {
    res.status(500).json({ message: 'Error liking recipe', error: err.message });
  }
};

// Unlike
exports.unlikeRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
    res.json({ message: 'Recipe unliked' });
  } catch (err) {
    res.status(500).json({ message: 'Error unliking recipe', error: err.message });
  }
};

// Recent
exports.getRecent = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(10).populate('author','username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent', error: err.message });
  }
};

// Popular
exports.getPopular = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ 'likes.length': -1 })
      .limit(10)
      .populate('author','username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching popular', error: err.message });
  }
};

// Comment count
exports.getCommentCount = async (req, res) => {
  try {
    const count = await Comment.countDocuments({ recipe: req.params.id });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comment count', error: err.message });
  }
};
