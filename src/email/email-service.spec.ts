import { EmailClient } from "./email-client";
import { EmailService } from "./email-service";
import { Email, EmailType } from "./email-type";
import { emailFlowMap } from "./email-flow-map";
import { HttpError } from "../utils/error";

describe("Email service test", () => {
  let emailService: EmailService;
  let mockEmailClient: EmailClient;

  beforeEach(() => {
    jest.useFakeTimers();

    mockEmailClient = {
      sendEmail: jest.fn((_: Email) => {
        return Promise.resolve(true);
      }),
    };
    emailService = new EmailService(mockEmailClient);
  });

  it("Signup Flow: should schedule email with delay", async () => {
    jest.spyOn(global, "setTimeout");

    const signupEmail: Email = emailFlowMap.get(EmailType.SIGNUP)![0];

    await emailService.handleEmailEvent({
      eventName: EmailType.SIGNUP,
      userEmail: "test@test.com",
    });

    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(0);

    jest.runAllTimers();

    expect(mockEmailClient.sendEmail).toHaveBeenCalledWith(signupEmail);
    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(1);
    expect(global.setTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      120 * 60 * 1000
    );
  });

  it("Purchase Flow: Should send email immediately and then one with delay", async () => {
    const firstPurchaseEmail: Email = emailFlowMap.get(
      EmailType.SOCKS_PURCHASED
    )![0];
    const secondPurchaseEmail: Email = emailFlowMap.get(
      EmailType.SOCKS_PURCHASED
    )![1];

    await emailService.handleEmailEvent({
      eventName: EmailType.SOCKS_PURCHASED,
      userEmail: "test@test.com",
    });

    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailClient.sendEmail).toHaveBeenCalledWith(firstPurchaseEmail);

    jest.runAllTimers();

    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(2);
    expect(mockEmailClient.sendEmail).toHaveBeenCalledWith(secondPurchaseEmail);
  });

  it("Should error when immediate email cannot be sent", async () => {
    mockEmailClient.sendEmail = jest.fn((_: Email) => Promise.resolve(false));

    expect(() =>
      emailService.handleEmailEvent({
        eventName: EmailType.SOCKS_PURCHASED,
        userEmail: "test@test.com",
      })
    ).rejects.toThrow(HttpError);

    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("Should print error when scheduled email cannot be sent", async () => {
    mockEmailClient.sendEmail = jest.fn((_: Email) => Promise.resolve(false));
    const logSpy = jest
      .spyOn(console, "error");

    await emailService.handleEmailEvent({
      eventName: EmailType.SIGNUP,
      userEmail: "test@test.com",
    });

    await jest.runAllTimersAsync();

    expect(mockEmailClient.sendEmail).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalled();
  });

  // TODO test scenario where server hasn't implemented email type
});
