"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2">
        <div className="grid gap-1">
          <Button
            variant={theme === "light" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4" />
            <span>Clair</span>
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4" />
            <span>Sombre</span>
          </Button>
          <Button
            variant={theme === "system" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setTheme("system")}
          >
            <Laptop className="h-4 w-4" />
            <span>Système</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
