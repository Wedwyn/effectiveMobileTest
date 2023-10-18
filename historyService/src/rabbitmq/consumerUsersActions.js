import amqp from 'amqplib';
import knex from 'knex';
import { development } from '../../knexfile.js';

const db = knex(development);
const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
const exchange = 'user_exchange';

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });

    const queue = 'user_events';
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, '#');

    return channel;
  } catch (err) {
    console.error('Error establishing connection to RabbitMQ:', err);
    throw err;
  }
};

const consumeMessages = async (rabbitmqChannel) => {
  try {
    const queue = 'user_events';
    const prefetchCount = 1;

    await rabbitmqChannel.prefetch(prefetchCount);
    await rabbitmqChannel.consume(queue, async (message) => {
      const { content } = message;

      if (content) {
        const actionData = JSON.parse(content.toString());
        const actionType = message.fields.routingKey;

        await saveActionToDatabase(actionData, actionType);

        await rabbitmqChannel.ack(message);
      }
    });
  } catch (err) {
    console.error('Error consuming messages from RabbitMQ:', err);
    throw err;
  }
};

const saveActionToDatabase = async (actionData, action_type) => {
  const userAction = {
    user_id: actionData.id,
    action_type,
    changed_fields: actionData.userData,
    action_time: actionData.actionTime,
  };

  try {
    await db('users_actions').insert(userAction);
    console.log('The record was successfully added to the database.');
  } catch (error) {
    console.error('Error when adding a record to the database:', error);
    throw error;
  }
};

export const catchMessage = async () => {
  try {
    const rabbitmqChannel = await connectToRabbitMQ();
    consumeMessages(rabbitmqChannel);
  } catch (err) {
    console.error('Error catching messages from RabbitMQ:', err);
  }
};
