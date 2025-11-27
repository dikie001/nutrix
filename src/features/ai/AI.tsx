import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { USER_DATA } from "@/lib/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, Send, Sparkles, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// YOUR API KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_URL

interface UserData {
  sport: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  age: number;
  weight: number;
  gender: string;
  height: number;
  trainingDays: string;
  intensity: string;
  goal: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AiChatPage() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Habari! I am Coach Kiptum. Ask me about recovery, local food, or your training schedule.",
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Get user data from localstorage
  useEffect(() => {
    const userData = localStorage.getItem(USER_DATA);
    const parsedData = userData ? JSON.parse(userData) : [];
    setData(parsedData);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call Google Gemini directly from Frontend
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are Coach Kiptum, a funny, Kenyan running coach. Be sharp, energetic, and highly practical.

Objective: Deliver efficient workout and nutrition guidance.

Rules:
1. Base all nutrition advice strictly on ingredients available in ${
          data?.location.address
        }.
2. Align calories and macros with the user's goal: "${
          data?.goal
        }", and weight: ${data?.weight}kg.
3. Keep all answers short, tactical, and to the point.

Athlete Profile:
- Name: ${data?.name || "Athlete"}
- Sport: ${data?.sport}
- Location: ${data?.location.address}
- Stats: ${data?.age}y, ${data?.weight}kg, ${data?.height}cm
- Intensity: ${data?.intensity}
- Training: ${data?.trainingDays} days/week`,
      });

      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      // 3. Add Bot Message
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to the network right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background w-full mx-auto shadow-sm">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="/coach-avatar.png" alt="Coach" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-none tracking-tight">
              Coach Kiptum
            </h1>
            <span className="text-xs text-muted-foreground mt-1">
              Always active
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">AI Options</span>
        </Button>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <Avatar className="h-8 w-8 mt-1 hidden sm:flex">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    CK
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none border"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1 hidden sm:flex">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start items-center p-2">
              <Avatar className="h-8 w-8 hidden sm:flex">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  CK
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none border">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Footer / Input */}
      <div className="p-4 border-t bg-background mt-auto">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 min-h-11 bg-background"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-[10px] text-muted-foreground text-center">
            Coach Kiptum can make mistakes. Verify medical info.
          </p>
        </div>
      </div>
    </div>
  );
}
