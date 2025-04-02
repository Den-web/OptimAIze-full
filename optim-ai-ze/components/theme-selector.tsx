import { useState } from "react";
import { useThemeContext } from "@/components/theme-provider";
import {
  Moon,
  Sun,
  Laptop,
  Check,
  Circle,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const themeColorOptions = [
  { name: "Blue", value: "blue", color: "#3b82f6" },
  { name: "Green", value: "green", color: "#22c55e" },
  { name: "Purple", value: "purple", color: "#a855f7" },
  { name: "Orange", value: "orange", color: "#f97316" },
  { name: "Rose", value: "rose", color: "#f43f5e" },
];

export function ThemeSelector() {
  const { theme, setTheme, themeColor, setThemeColor } = useThemeContext();
  const [activeTab, setActiveTab] = useState("mode");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Laptop className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Tabs defaultValue="mode" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mode">Mode</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
          </TabsList>
          <TabsContent value="mode" className="p-1">
            <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={theme === "light" ? "bg-accent" : ""}
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={theme === "dark" ? "bg-accent" : ""}
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={theme === "system" ? "bg-accent" : ""}
              onClick={() => setTheme("system")}
            >
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </TabsContent>

          <TabsContent value="color" className="p-1">
            <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-5 gap-1 py-2">
              {themeColorOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex flex-col items-center justify-center p-1 rounded-md hover:bg-accent ${
                    themeColor === option.value ? "ring-1 ring-primary" : ""
                  }`}
                  onClick={() => setThemeColor(option.value)}
                  title={option.name}
                >
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  {themeColor === option.value && (
                    <Check className="h-3 w-3 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 