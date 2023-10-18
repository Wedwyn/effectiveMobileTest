import express from 'express';
import { Model } from 'objection';
import knex from 'knex';
import moment from 'moment';
import User from './models/User.js';
import { development } from '../knexfile.js';
import bodyParser from 'body-parser';
import {
  connectToRabbitMQ,
  exchange,
} from './rabbitmq/pablisherUsersActions.js';
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Model.knex(knex(development));

const rabbitmqChannel = await connectToRabbitMQ();

const userRouter = express.Router();

userRouter
  .get('/users', async (req, res) => {
    const users = await User.query();
    res.send(users);
  })
  .post('/users', async (req, res) => {
    try {
      const newUser = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        age: Number(req.body.age),
      };
      const user = await User.query().insert(newUser);

      // console.log(user);
      const actionTime = moment().format();

      const { id, ...userToPublish } = user;

      await rabbitmqChannel.publish(
        exchange,
        'created',
        Buffer.from(
          JSON.stringify({ id, userData: { ...userToPublish }, actionTime })
        ),
        {
          persistent: true,
        }
      );

      res.status(201).send('Request successfully processed!');
    } catch (err) {
      res.status(500).send('Server error');
      throw err;
    }
  })
  .patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = { ...req.body };
      if (Object.hasOwn(user, 'age')) {
        user.age = Number(user.age);
      }

      const currentUser = await User.query().findById(id);
      await currentUser.$query().patch(user);

      const actionTime = moment().format();

      await rabbitmqChannel.publish(
        exchange,
        'update',
        Buffer.from(JSON.stringify({ id, userData: { ...user }, actionTime })),
        {
          persistent: true,
        }
      );

      res.status(201).send(`User with id ${id} has been successfully updated`);
    } catch (err) {
      res.status(500).send('Server error');
      throw err;
    }
  });

app.use('/', userRouter);

export default app;
