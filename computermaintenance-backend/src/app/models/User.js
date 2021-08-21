const mongoose = require('mongoose');

class User {
  schema() {
    const userSchema = new mongoose.Schema(
      {
        username: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
    );

    return mongoose.model('User', userSchema);
  }
}

module.exports = new User().schema();
