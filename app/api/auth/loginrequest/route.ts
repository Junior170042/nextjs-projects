import { isEmail } from "@/app/utils/validator";
import { NextResponse } from "next/server";
import * as UserServices from "@/app/api/services/user.service";
import * as EmailServices from "@/app/api/services/email.service";
import jwt from "jsonwebtoken";
import { hasTimePassed } from "@/app/components/lib/utils";
import { handleError } from "../../api_helpers";


export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body

    try {

        if (!isEmail(email)) return NextResponse.json({ success: false, error: "Invalid email address!" });
        const user = await UserServices.verifyUser(email.toLowerCase());
        if (!user || !user.id) {
            const { code, expireAt, requestedAt } = await EmailServices.sendVerificationCode(email.toLowerCase()) as { code: string, expireAt: number, requestedAt: number };

            const verificationToken = jwt.sign({ email, code, expireAt, requestedAt }, process.env.JWT_VERIFY_SECRET!, { expiresIn: "7d" });
            await UserServices.setNewUser(email.toLowerCase(), verificationToken);
            return NextResponse.json({ success: true, message: "Code sent!" }, { status: 200 });
        }

        if (user.id && (!user.verificationToken || user.verificationToken === "")) {
            const { code, expireAt, requestedAt } = await EmailServices.sendVerificationCode(email.toLowerCase()) as { code: string, expireAt: number, requestedAt: number };

            const verificationToken = jwt.sign({ email, code, expireAt, requestedAt }, process.env.JWT_VERIFY_SECRET!, { expiresIn: "7d" });
            await UserServices.updateVerificationToken(email.toLowerCase(), verificationToken);
            return NextResponse.json({ success: true, message: "Code sent!" }, { status: 200 });
        }

        const { expireAt, requestedAt } = jwt.verify(user.verificationToken as string, process.env.JWT_VERIFY_SECRET!) as { expireAt: number, requestedAt: number };

        if (!hasTimePassed(Number(expireAt), { minutes: 30 })) {
            return NextResponse.json({ success: false, error: "Must verify auth code!" }, { status: 401 });
        }

        if (!hasTimePassed(Number(requestedAt), { days: 1 }) && hasTimePassed(Number(expireAt), { minutes: 30 })) {
            return NextResponse.json({ success: false, error: "A few minutes ago, you made a request that you did not finish, please try again after 24 hours!" }, { status: 401 });
        }

        if (hasTimePassed(Number(requestedAt), { days: 1 })) {
            const { code, expireAt, requestedAt } = await EmailServices.sendVerificationCode((email.toLowerCase())) as { code: string, expireAt: number, requestedAt: number };

            const verificationToken = jwt.sign({ email, code, expireAt, requestedAt }, process.env.JWT_VERIFY_SECRET!, { expiresIn: "7d" });
            await UserServices.updateVerificationToken(email.toLowerCase(), verificationToken);
            return NextResponse.json({ success: true, message: "Code sent!" }, { status: 200 });
        }

        return NextResponse.json({ success: false, error: "Something went wrong!" }, { status: 401 });

    } catch (error: any) {
        if (error.name === "TokenExpiredError" || error.message === "jwt expired") {
            const { code, expireAt, requestedAt } = await EmailServices.sendVerificationCode(email.toLowerCase()) as { code: string, expireAt: number, requestedAt: number };

            const verificationToken = jwt.sign({ email, code, expireAt, requestedAt }, process.env.JWT_VERIFY_SECRET!, { expiresIn: "7d" });
            await UserServices.updateVerificationToken(email.toLowerCase(), verificationToken);
            return NextResponse.json({ success: true, message: "Code sent!" }, { status: 200 });
        } else {
            return handleError(error, "user login");
        }
    }
}