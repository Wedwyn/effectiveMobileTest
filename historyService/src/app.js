import app from './routes.js';
import 'dotenv/config';
import { catchMessage } from './rabbitmq/consumerUsersActions.js';

catchMessage();

app.listen(process.env.PORT_HISTORY, () => {
  console.log(`Server started on port ${process.env.PORT_HISTORY}`);
});
