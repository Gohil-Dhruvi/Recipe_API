const express = require('express');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getByTag,
  getByCategory,
  likeRecipe,
  unlikeRecipe,
  getPopular,
  getRecent,
  getCommentCount
} = require('../controller/recipeController.controller');
const { verifyUserToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/my/allrecipes', verifyUserToken, getMyRecipes);
router.post('/create', verifyUserToken, createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', verifyUserToken, updateRecipe);
router.delete('/:id', verifyUserToken, deleteRecipe);

router.get('/search', searchRecipes);
router.get('/tag/:tagName', getByTag);
router.get('/category/:categoryName', getByCategory);

router.post('/:id/like', verifyUserToken, likeRecipe);
router.delete('/:id/unlike', verifyUserToken, unlikeRecipe);

router.get('/popular', getPopular);
router.get('/recent', getRecent);
router.get('/:id/comments/count', getCommentCount);

module.exports = router;
