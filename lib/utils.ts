import { UserRole } from "@/app/types";
import { publicRoutes, RoutesRoles } from "@/app/utils/datas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isRoleAllowed({ role, path }: { role: string, path: string }) {
  return RoutesRoles[role as keyof typeof RoutesRoles].includes(path);
}

export function isPublicRoute(path: string) {
  return publicRoutes.includes(path);
}
export function checkUserLevel({ CurrentRole, AllowedRoles }: { CurrentRole: keyof typeof UserRole, AllowedRoles: UserRole[] }) {
  return AllowedRoles.includes(CurrentRole as UserRole);
}
