import 'dotenv/config'
import express from "express";
import questionsRouter from './routes/questionsRouter.mjs';
import answersRouter from './routes/answersRouter.mjs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionsRouter)
app.use("/questions", answersRouter);
app.use("/answers", answersRouter);



app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
