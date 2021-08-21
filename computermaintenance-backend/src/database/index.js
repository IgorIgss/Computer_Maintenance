const mongoose = require('mongoose');

class Database {
  constructor() {
    this.mongodbConnect();
  }

  async mongodbConnect() {
    mongoose.Promise = global.Promise;

    await mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

module.exports = new Database();
