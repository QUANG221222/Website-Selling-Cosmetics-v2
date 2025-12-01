"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/lib/socket/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/redux/user/userSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "admin";
  message: string;
  timestamp: Date;
  isRead: boolean;
  isDeleted: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isConnected } = useSocket();
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.emit("join_room", {
      userId: currentUser._id,
      roomId: roomId,
      userName: currentUser.fullName,
      userRole: "customer",
    });

    socket.on(
      "room_joined",
      (data: { roomId: string; messages: Message[] }) => {
        setRoomId(data.roomId);
        setMessages(data.messages);
      }
    );

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (!isOpen && message.senderRole === "admin") {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("message_deleted", (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, isDeleted: true, message: "Tin nhắn đã bị xóa" }
            : msg
        )
      );
    });

    return () => {
      socket.off("room_joined");
      socket.off("receive_message");
      socket.off("message_deleted");
    };
  }, [socket, currentUser, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !roomId || !currentUser) return;

    socket.emit("send_message", {
      roomId,
      senderId: currentUser._id,
      senderName: currentUser.fullName,
      senderRole: "customer",
      message: inputMessage,
    });

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed top-[70%] right-6 h-16 w-16 rounded-full bg-brand-deep-pink hover:bg-brand-deep-pink/90 shadow-2xl z-50 flex items-center justify-center"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[550px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-brand-deep-pink text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-inter flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat với Shop
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-white/80 mt-1">
              {isConnected ? "🟢 Đang kết nối" : "🔴 Mất kết nối"}
            </p>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col bg-gray-50 overflow-auto">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Chưa có tin nhắn</p>
                    <p className="text-sm">Hãy gửi tin nhắn đầu tiên!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.senderId === currentUser._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          msg.senderId === currentUser._id
                            ? "bg-brand-deep-pink text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                        } ${msg.isDeleted ? "italic opacity-60" : ""}`}
                      >
                        {msg.senderRole === "admin" && (
                          <p className="text-xs font-semibold mb-1 opacity-75">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === currentUser._id
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-full"
                  disabled={!isConnected}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 rounded-full w-10 h-10 p-0"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
