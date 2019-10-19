const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const seeds = require('./seeds');

const app = express();
const adapter = new FileSync('db.json');
const db = low(adapter);

const generateUid = () => `${Date.now()}${Math.random()}`;
const getUser = ({ token, username, password, ...user }, req) => {
  const me = getMe(req);

  return {
    ...user,
    username: me.role === 'patient' && me.id !== user.id ? undefined : username,
    password:
      user.role !== 'admin' &&
      (me.role === 'admin' || user.id === me.id || user.role === 'patient')
        ? password
        : undefined,
  };
};

const getMe = req =>
  db
    .get('users')
    .find({ token: req.get('token') })
    .value();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const privateUrls = ['/users', '/medicaments', '/services'];
  const permissionLevel = { patient: 0, nurse: 1, dr: 2, admin: 3 };
  console.log(req.path);

  if (!privateUrls.includes(req.path)) return next();

  const me = getMe(req);

  if (!me) return res.status(401).end();

  if (
    (permissionLevel[me.role] < 1 && req.method !== 'GET') ||
    (req.path === '/users' &&
      // nurses cannot create doctors or admins, doctors cannot create admins
      permissionLevel[req.body.role] > permissionLevel[me.role])
  ) {
    return res.status(403).end();
  }

  next();
});

db.defaults(seeds).write();

app.get('/medicaments', (req, res) => {
  res.send(db.get('medicaments').value());
});

app.post('/medicaments', (req, res) => {
  const medicament = { ...req.body, id: generateUid() };

  db.get('medicaments')
    .push(medicament)
    .write();
  res.status(201).send(medicament);
});

app.post('/medicaments/:id', (req, res) => {
  const medicamentEntry = db.get('medicaments').find({ id: req.params.id });
  const medicament = medicamentEntry.value();

  if (!medicament) return res.status(404).end();

  medicamentEntry.assign({ ...req.body, id: medicament.id }).write();
  res.send(medicamentEntry.value());
});

app.delete('/medicaments/:id', (req, res) => {
  db.get('medicaments')
    .remove({ id: req.params.id })
    .write();

  res.status(204).end();
});

app.get('/services', (req, res) => {
  res.send(db.get('services').value());
});

app.post('/services', (req, res) => {
  const service = { ...req.body, id: generateUid() };

  db.get('services')
    .push(service)
    .write();
  res.status(201).send(service);
});

app.post('/services/:id', (req, res) => {
  const serviceEntry = db.get('services').find({ id: req.params.id });
  const service = serviceEntry.value();

  if (!service) return res.status(404).end();

  serviceEntry.assign({ ...req.body, id: service.id }).write();
  res.send(serviceEntry.value());
});

app.delete('/services/:id', (req, res) => {
  db.get('services')
    .remove({ id: req.params.id })
    .write();

  res.status(204).end();
});

app.get('/users', (req, res) => {
  const { role } = req.query;
  const users = db
    .get('users')
    .filter(user => {
      if (role === 'patient') return user.role === 'patient';

      return ['dr', 'nurse'].includes(user.role);
    })
    .value()
    .map(user => getUser(user, req));

  res.send(users);
});

app.post('/users', (req, res) => {
  const user = { ...req.body, id: generateUid() };

  db.get('users')
    .push(user)
    .write();

  res.status(201).send(user);
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = db
    .get('users')
    .find(user => user.id === id)
    .value();

  if (!user) return res.status(404).end();

  if (user.token !== req.get('token')) return res.status(403).end();

  res.send(getUser(user, req));
});

app.post('/users/:id', (req, res) => {
  const { id } = req.params;
  const userEntry = db.get('users').find(user => user.id === id);
  const user = userEntry.value();
  const me = getMe(req);

  if (!user) return res.status(404).end();

  userEntry
    .assign({
      ...req.body,
      id,
      password:
        me.role === 'admin' || me.id === id ? req.body.password : user.password,
    })
    .write();
  res.send(userEntry.value());
});

app.get('/user', (req, res) => {
  const user = db
    .get('users')
    .find({ token: req.get('token') })
    .value();

  if (!user) return res.status(401).end();

  res.send(user);
});

app.post('/user', (req, res) => {
  const { username, password } = req.body;
  const user = db.get('users').find({ username, password });

  if (!user.value()) return res.status(401).end();

  user.assign({ token: generateUid() }).write();
  res.send(user.value());
});

app.put('/user', (req, res) => {
  const userEntry = db.get('users').find({ token: req.get('token') });
  const user = userEntry.value();

  if (!user) return res.status(401).end();

  userEntry.assign({ ...req.body, role: user.role }).write();
  res.send(userEntry.value());
});

app.listen(3003, () => console.log('API server listening on port 3003'));
