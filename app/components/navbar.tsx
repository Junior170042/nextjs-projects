"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, PlusSquare, Home, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserRoles } from "./lib/utils";
import Image from "next/image";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const currentPath = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const isPathMatched = useCallback((path: string) => {
        return currentPath === path;
    }, [currentPath]);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center max-h-full">
                    <Link href="/" className="flex items-center h-16">
                        <Image src="/postOne.png" alt="Logo" width={150} height={20}
                            className="filter drop-shadow-lg rounded-full dark:invert-[100%]" />
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4 pr-4">
                    {user ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={isPathMatched("/") ? "secondary" : "ghost"}
                                    size="icon"
                                    asChild
                                >
                                    <Link href="/" aria-label="Dashboard">
                                        <Home className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant={isPathMatched("/create-post") ? "secondary" : "ghost"}
                                    size="icon"
                                    asChild
                                >
                                    <Link href="/create-post" aria-label="Create Post">
                                        <PlusSquare className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 cursor-pointer border">
                                        <AvatarImage src={user.picture || undefined} />
                                        <AvatarFallback className="bg-primary/10">
                                            <UserIcon className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                                        Signed In As:
                                    </DropdownMenuLabel>
                                    <DropdownMenuLabel className="font-medium truncate">
                                        {user.email}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {user.userRole === UserRoles.ADMIN && (
                                        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button className=" main-btn rounded-full px-6 text-white" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}
