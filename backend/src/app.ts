import express from 'express';
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import menuRouter from './routes/menu.routes.js'

const app = express();

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(menuRouter);


app.get('/' ,(req, res) => {
    res.send("Welcome to Kabob Express");
});

export default app;