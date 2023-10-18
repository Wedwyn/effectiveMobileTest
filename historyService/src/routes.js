import express from 'express';
import knex from 'knex';
import { development } from '../knexfile.js';

const db = knex(development);
import 'dotenv/config';

const app = express();

const historyRouter = express.Router();

historyRouter.get('/actions', async (req, res) => {
  const { userId, limit, offset } = req.query;
  let query = db.from('users_actions').select('*');
  if (userId) {
    query = query.where('user_id', Number(userId));
  }
  if (limit) {
    query = query.limit(Number(limit));
  }
  if (offset) {
    query = query.offset(Number(offset));
  }
  try {
    const usersData = await query;
    res.send(usersData);
  } catch (err) {
    console.log('Database error');
    throw err;
  }
});

app.use('/', historyRouter);

export default app;
