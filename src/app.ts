import * as express from 'express';
import apis from './apis';

const app = express();

app.use(/*'/api',*/ apis);

app.listen('8000', () => console.log('listening...'));
