import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";


import { AppError } from "./utils/AppError";
import { migrationsRun } from "./database/sqlite/migrations";
import { router } from "./routes";

const app = express();

app.use(express.json());

migrationsRun();

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

app.listen(3333, () => {
  console.log("Server started on port 3333");
});