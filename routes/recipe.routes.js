const express = require('express');
const { 
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe
} = require('../controller/recipeController.controller');
const { verifyUserToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',               getAllRecipes);
router.get('/my/allrecipes',  verifyUserToken, getMyRecipes);
router.post('/create',        verifyUserToken, createRecipe);
router.get('/:id',            getRecipeById);
router.put('/:id',            verifyUserToken, updateRecipe);
router.delete('/:id',         verifyUserToken, deleteRecipe);

module.exports = router;
