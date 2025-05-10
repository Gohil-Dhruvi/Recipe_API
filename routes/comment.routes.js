const express = require('express');
const router  = express.Router();
const { verifyUserToken } = require('../middleware/authMiddleware');
const {
  addComment,
  getCommentsByRecipe,
  deleteComment
} = require('../controller/commentController.controller');

// list all comments for a recipe
router.get('/:recipeId', getCommentsByRecipe);

//  add a comment (must be logged in)
router.post('/:recipeId', verifyUserToken, addComment);

//  delete a comment (author or admin)
router.delete('/:commentId', verifyUserToken, deleteComment);

module.exports = router;
