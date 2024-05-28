import type { ErrorRequestHandler, NextFunction } from "express";
import express, { Express, Request, Response } from "express";
import { ExternalEmailClient } from "./email/email-client";
import { EmailService } from "./email/email-service";
import { validateEmailEvent } from "./email/email-validator";
import { HttpError } from "./utils/error";

const app: Express = express();
const port = 3000;

app.use(express.json());

const emailService = new EmailService(new ExternalEmailClient());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Server!");
});

app.post("/emails", (req: Request, res: Response, next: NextFunction) => {
  const event = validateEmailEvent(req.body);

  emailService
    .handleEmailEvent(event)
    .then(() => res.status(202).send("Email request accepted!"))
    .catch(next);
});

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
) => {
  console.error(err.stack);

  if (err instanceof HttpError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send("Internal Error!");
  }
};

app.use(errorHandler);
