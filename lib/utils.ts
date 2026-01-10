import { UserRole } from "@/app/types";
import { RoutesRoles } from "@/app/utils/datas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isRoleAllowed({ role, path }: { role: string, path: string }) {
  const cleanPath = path.replace(/^\//, '');
  const cleanRole = role.replace(/^\//, '').toLowerCase();
  return RoutesRoles[cleanRole as keyof typeof RoutesRoles].includes(cleanPath);
}

export function checkUserLevel({ CurrentRole, AllowedRoles }: { CurrentRole: keyof typeof UserRole, AllowedRoles: UserRole[] }) {
  const cleanRole = CurrentRole.replace(/^\//, '').toUpperCase() as keyof typeof UserRole;
  return AllowedRoles.includes(UserRole[cleanRole]);
}
