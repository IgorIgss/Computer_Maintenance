const Router = require('express').Router;

const UserController = require('./app/controllers/UserController');
const ProtocolController = require('./app/controllers/ProtocolController');

const routes = Router();

// UserController Routes
routes.post('/register', UserController.registerUser);
routes.post('/login', UserController.loginUser);
routes.delete('/delete/:username', UserController.deleteUser);
routes.get('/users', UserController.listAllUsers);
routes.get('/user/:username', UserController.listUser);

// ProtocolController Routes
routes.post('/register/protocol', ProtocolController.registerDataProtocol);
routes.put('/protocol/update/:id', ProtocolController.updateProtocol);
routes.delete('/protocol/delete/:id', ProtocolController.deleteProtocol);
routes.get('/protocols', ProtocolController.listAllProtocols);
routes.get('/protocol/:protocol', ProtocolController.listProtocol);

module.exports = routes;
