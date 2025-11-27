import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AiChatPage() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: "bot", 
      text: "Habari! I am Coach Kiptum. Ask me about recovery, local food, or your training schedule.", 
      timestamp: new Date() 
    },
  ]);
  
  // Ref for auto-scrolling
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      sender: "user", 
      text: input, 
      timestamp: new Date() 
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: "bot", 
        text: data.reply, 
        timestamp: new Date() 
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
        console.log(error)
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting to the network right now.", 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    // h-[100dvh] ensures it takes full height on mobile browsers including address bar area
    <div className="flex flex-col h-dvh mt-4 bg-background w-full max-w-md mx-auto md:max-w-4xl border-x shadow-sm">
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur upports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="/coach-avatar.png" alt="Coach" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-none tracking-tight">Coach Kiptum</h1>
            <span className="text-xs text-muted-foreground mt-1">Always active</span>
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
              {/* Bot Avatar */}
              {msg.sender === "bot" && (
                <Avatar className="h-8 w-8 mt-1 hidden sm:flex">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">CK</AvatarFallback>
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
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1 hidden sm:flex">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start items-center p-2">
              <Avatar className="h-8 w-8 hidden sm:flex">
                 <AvatarFallback className="bg-primary/10 text-primary text-xs">CK</AvatarFallback>
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