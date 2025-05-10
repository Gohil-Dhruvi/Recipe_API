const Comment = require('../model/comment.model');
const Recipe  = require('../model/recipe.model');

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = new Comment({
      text,
      createdBy: req.user._id,
      recipe: req.params.recipeId
    });
    await comment.save();

    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recipe.comments.push(comment._id);
    await recipe.save();

    await comment.populate('createdBy', 'username');
    res.status(201).json(comment);

  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

exports.getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!comment.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.deleteOne();
    await Recipe.findByIdAndUpdate(
      comment.recipe,
      { $pull: { comments: comment._id } }
    );

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
