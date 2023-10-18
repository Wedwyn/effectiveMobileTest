import amqp from 'amqplib';

const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
export const exchange = 'user_exchange';

export const connectToRabbitMQ = async () => {
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
  }
};

// const rabbitmqChannel = await connectToRabbitMQ();
