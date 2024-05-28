import { Email } from "./email-type";

export interface EmailClient {
  sendEmail(email: Email): Promise<boolean>;
}

export class ExternalEmailClient implements EmailClient {
  async sendEmail(_: Email) {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Simulating an asynchronous operation, e.g., sending an email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 95% chance to return true, 5% chance to return false - emails fail
    const success = randomNumber < 0.9;

    return false;
  }
}
