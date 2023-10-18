import app from './routes.js';
import 'dotenv/config';

app.listen(process.env.PORT_USER, () => {
  console.log(`Server started on port ${process.env.PORT_USER}`);
});
