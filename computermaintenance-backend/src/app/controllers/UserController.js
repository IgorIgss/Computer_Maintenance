const bcrypt = require('bcryptjs');
const neo4j = require('neo4j-driver');
const UserModel = require('../models/User');

const driver = neo4j.driver(
  process.env.NEO4J_LOCAL_IP
    ? `bolt://${process.env.NEO4J_LOCAL_IP}`
    : 'bolt://192.168.2.8',
  neo4j.auth.basic('neo4j', 'streams')
);

const session = driver.session({
  database: 'neo4j',
  defaultAccessMode: neo4j.session.WRITE,
});
class UserController {
  async registerUser(req, res) {
    const { username, password } = req.body;

    const userExists = await UserModel.findOne({ username });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 6);

    const user = await UserModel.create({
      username,
      password: passwordHash,
    });

    if (!user) {
      return res.status(400).json({ error: 'Error registering user.' });
    }

    session
      .run(
        'CREATE(n:Users { username: $usernameParam, password: $passwordParam }) RETURN n.username',
        {
          usernameParam: user.username,
          passwordParam: user.password,
          createdAtParam: String(user.createdAt),
          updatedAtParam: String(user.updatedAt),
        }
      )
      .then(async () => {
        await session.close();
      })
      .catch((err) => new Error(err));

    return res.json(user);
  }

  async loginUser(req, res) {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Error logging in user.' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Password is wrong.' });
    }

    user.password = undefined;
    user.__v = undefined;

    return res.json(user);
  }

  async deleteUser(req, res) {
    const { username } = req.params;

    const user = await UserModel.findOneAndDelete({ username });

    if (!user) {
      return res.status(400).json({ error: 'Error deleting user.' });
    }

    return res.send();
  }

  async listAllUsers(req, res) {
    const users = await UserModel.find({}, '-__v -password').sort('DESC');

    if (!users) {
      return res.status(400).json({ error: 'Error when listing users.' });
    }

    return res.json(users);
  }

  async listUser(req, res) {
    const { username } = req.params;

    const user = await UserModel.findOne({ username }, '-__v -password');

    if (!user) {
      return res.status(400).json({ error: 'Error while listing user.' });
    }

    return res.json(user);
  }
}

module.exports = new UserController();
