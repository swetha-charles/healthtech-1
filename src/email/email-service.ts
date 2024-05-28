import { HttpError } from "../utils/error";
import { emailFlowMap } from "./email-flow-map";
import { DelayedEmail as ScheduledEmail, Email, EmailEvent, EmailType } from "./email-type";
import { EmailClient } from "./email-client";

export class EmailService {
  constructor(private emailClient: EmailClient) {}

  public async handleEmailEvent(event: EmailEvent) {
    const emailList = this.getFlowForEmailType(event.eventName);

    for (const email of emailList) {
      if (email.delayMinutes != undefined) {
        this.sendScheduledEmail(email as ScheduledEmail);
      } else {
        await this.sendImmediateEmail(email);
      }
    }
  }

  private async sendScheduledEmail(email: ScheduledEmail) {
    setTimeout(() => {
      this.emailClient.sendEmail(email).then((success) => {
        if (!success) {
          console.error("Scheduled email failed to send");
          // TODO Alert!
        }
      }).catch(_ => {
        console.error("Scheduled email failed to send");
        // TODO Alert!
      })
    }, email.delayMinutes * 60 * 1000); // convert to milliseconds
    // }, 100); // TODO testing only, remove later
  }

  // TODO: do we want to handle immediate and scheduled in the same way - PM question
  private async sendImmediateEmail(email: Email) {
    const success = await this.emailClient.sendEmail(email);
    if (!success) {
      console.error("Failed to send email");
      throw new HttpError("Failed to send email", 500);
    }
  }

  private getFlowForEmailType(type: EmailType): Email[] {
    const emailList = emailFlowMap.get(type);
    if (!emailList)
      throw new HttpError(
        "Unknown email type. Server has yet to implement this email flow.",
        501
      );

    return emailList;
  }
}
