const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const gravatar = require('../util/gravatar');
const mongoose = require('mongoose');

require('dotenv').config();

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    if (!user)
      throw new AuthenticationError('You must be signed in to create a note');

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
      favoriteCount: 0
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user)
      throw new AuthenticationError('You must be signed in to delete a note');

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id)
      throw new ForbiddenError("You don't have permissions to delete the note");

    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if (!user)
      throw new AuthenticationError('You must be signed in to delete a note');

    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id)
      throw new ForbiddenError("You don't have permissions to delete the note");

    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);

      throw new Error('Error createing account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase();

    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });

    if (!user) throw new AuthenticationError(`Error signing in`);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthenticationError(`Error signing in`);

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    if (!user) throw new AuthenticationError();

    // ???????????? ????????? ?????? ????????????????????? ??????
    let noteCheck = await models.Note.findById(id);
    const hashUser = noteCheck.favoritedBy.indexOf(user.id);

    console.log(noteCheck, hashUser);
    // ???????????? ????????? ?????????
    // favoriteCount??? 1????????? ???????????? ????????? ??????
    if (hashUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          // new??? true??? ???????????? ??????????????? doc??????
          new: true
        }
      );
    } else {
      // ???????????? ????????? ?????????
      // favoriteCount??? 1????????? ???????????? ????????? ??????
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
  }
};
