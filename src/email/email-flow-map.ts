import { Email, EmailType } from "./email-type";

export const emailFlowMap: Map<EmailType, Email[]> = new Map([
  [
    EmailType.SIGNUP,
    [{ subject: "Welcome", body: "Need some socks?", delayMinutes: 120 }],
  ],
  [
    EmailType.SOCKS_PURCHASED,
    [
      { subject: "Payment Received", body: "Thank you!" },
      { subject: "Socks dispatched", body: "Get ready!", delayMinutes: 5 },
    ],
  ]
]);
