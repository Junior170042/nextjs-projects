import { throwError } from "../api_helpers";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASSWORD!,
    },
});

export const sendVerificationCode = async (to: string) => {
    try {
        const sixDigitCode = Math.floor(100000 + Math.random() * 900000);
        const code = sixDigitCode.toString();
        await transporter.sendMail({
            from: `postOneApp <${process.env.GMAIL_USER!}>`,
            to,
            subject: "Verification Code",
            text: `Your verification code is: ${code}`,
        });

        return { code, expireAt: Date.now() + 30 * 60 * 1000, requestedAt: Date.now() };
    } catch (error: unknown) {
        throwError(error);
    }
}
