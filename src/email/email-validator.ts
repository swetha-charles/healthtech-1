import { HttpError } from "../utils/error";
import { EmailEvent, EmailType } from "./email-type";

export const validateEmailEvent: (event: any) => EmailEvent = (event) => {
  if (
    event.eventName &&
    Object.values(EmailType).includes(event.eventName) &&
    event.userEmail &&
    typeof event.userEmail === "string" &&
    event.userEmail.length > 0
  ) {
    return event as EmailEvent;
  }
  throw new HttpError("Incorrect email parameters provided", 400);
};
