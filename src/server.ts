import express, { Application, Request, Response } from "express";

import { connectDB } from "./config/db";
import { dev } from "./config";
import createHttpError from "http-errors";
import { errorHandler } from "./middlewares/errorHandler";
import categoriesRouter from "./routers/categoryRoute";




const app: Application = express();

const port: number = dev.app.port || 3003;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDB();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Health checkup" });
});

// app.use("/products", productsRouter);
// app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);
// app.use("/orders", ordersRouter);

app.use((req, res, next) => {
  next(createHttpError(404, "Route Not Found"));
});
app.use(errorHandler);
