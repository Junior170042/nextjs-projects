"use client";
import { useTheme } from "next-themes";
import { Button } from "@/app/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 100);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
    );
};
