const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought
// Create a new thought
async createThought(req, res) {
  try {
      // Find the user by the username provided in the request body
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
          return res.status(404).json({ message: 'No user found with this username!' });
      }

      // Create the new thought
      const newThought = await Thought.create({
          thoughtText: req.body.thoughtText,
          username: req.body.username,
          reactions: req.body.reactions || []
      });

      // Add the thought to the user's thoughts array
      await User.findByIdAndUpdate(
          user._id,
          { $push: { thoughts: newThought._id } },
          { new: true }
      );

      res.json(newThought);
  } catch (err) {
      res.status(500).json(err);
  }
},

  // Update a thought by ID
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought by ID
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.id);
      if (!deletedThought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a reaction stored in a single thought's reactions array field
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Pull and remove a reaction by the reaction's reactionId value
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};


