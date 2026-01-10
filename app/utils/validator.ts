
import type { ValidateLoginResult } from "../types/index";

export function isEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isStrongPassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export function validateLogin(email: string, password: string): ValidateLoginResult {
    const errors: ValidateLoginResult['errors'] = {};
    if (!email || email === "") {
        errors.email = 'Email is required!';
    }
    if (!isEmail(email)) {
        errors.email = 'Invalid email address!';
    }

    if (!password || password === "") {
        errors.password = 'Password is required!';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export function validateRegister(name: string, email: string, password: string, confirmPassword: string) {
    const errors: ValidateLoginResult['errors'] = {};
    if (!name || name === "") {
        errors.name = 'Name is required!';
    }
    if (!email || email === "") {
        errors.email = 'Email is required!';
    }
    if (!isEmail(email)) {
        errors.email = 'Invalid email address!';
    }

    if (!password || password === "") {
        errors.password = 'Password is required!';
    }

    if (!confirmPassword || confirmPassword === "") {
        errors.confirmPassword = 'Confirm Password is required!';
    }

    //if name has any number
    if (name.match(/\d/)) {
        errors.name = 'Name must not contain numbers!';
    }

    //if name has any special character that is not a space
    if (name.match(/[^a-zA-Z0-9 ]/)) {
        errors.name = 'Name must not contain special characters!';
    }


    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match!';
    }

    if (!isNaN(Number(name))) {
        errors.name = 'Name must not be a number!';
    }

    if (!isStrongPassword(password)) {
        errors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}