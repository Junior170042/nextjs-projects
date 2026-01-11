import type { ToastOptions } from "nextjs-toast-notify";

export const toastOptions: ToastOptions = {
    duration: 2000,
    progress: true,
    position: "top-center",
    transition: "topBounce",
    icon: '',
    sound: true,
}

export const publicRoutes = [
    "/login",
    "/",
    "/forbidden"
]

export const RoutesRoles = {
    user: ["/create-post"],
    admin: ["/dashboard",]
}
