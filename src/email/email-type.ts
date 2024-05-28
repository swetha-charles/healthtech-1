export enum EmailType {
  SIGNUP = "emailSignup",
  SOCKS_PURCHASED = "socksPurchased",
  EMAIL_VERIFIED = "emailVerified",
}

export interface EmailEvent {
  eventName: EmailType;
  userEmail: string; // TODO constrain type to email string pattern
}

export type Email = {
  subject: string;
  body: string;
  delayMinutes?: number;
};

export type DelayedEmail = Required<Email>;