"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle } from "lucide-react";
import { useSocket } from "@/lib/socket/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentAdmin } from "@/lib/redux/admin/adminSlice";
import { socketApi } from "@/lib/api/chat";

interface Message {
  senderId: string;
  senderName: string;
  senderRole: "customer" | "admin";
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatRoom {
  _id: string;
  roomId: string;
  userId: string;
  userName: string;
  userRole: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: {
    customer: number;
    admin: number;
  };
  status: string;
}

export default function AdminChatPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const { socket, isConnected } = useSocket();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedRoom?.messages]);

  useEffect(() => {
    // Fetch all chat rooms
    const fetchChats = async () => {
      try {
        const res = await socketApi.fetchChats();
        setChatRooms(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "new_customer_message",
      (data: { roomId: string; message: Message }) => {
        // Update chat rooms with new message
        setChatRooms((prev) =>
          prev.map((room) =>
            room.roomId === data.roomId
              ? {
                  ...room,
                  messages: [...room.messages, data.message],
                  lastMessage: data.message.message,
                  lastMessageTime: data.message.timestamp,
                  unreadCount: {
                    ...room.unreadCount,
                    admin: room.unreadCount.admin + 1,
                  },
                }
              : room
          )
        );

        // Update selected room
        // if (selectedRoom?.roomId === data.roomId) {
        //   setSelectedRoom((prev) =>
        //     prev
        //       ? { ...prev, messages: [...prev.messages, data.message] }
        //       : null
        //   );
        // }
      }
    );

    socket.on("receive_message", (message: Message) => {
      if (selectedRoom) {
        setSelectedRoom((prev) =>
          prev ? { ...prev, messages: [...prev.messages, message] } : null
        );
      }
    });

    return () => {
      socket.off("new_customer_message");
      socket.off("receive_message");
    };
  }, [socket, selectedRoom]);

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    if (socket) {
      socket.emit("join_room", {
        userId: currentAdmin?.data?._id,
        roomId: room.roomId,
        userName: currentAdmin?.data?.fullname,
        userRole: "admin",
      });

      socket.emit("mark_as_read", { roomId: room.roomId, userRole: "admin" });
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !selectedRoom || !currentAdmin)
      return;

    const newMessage: Message = {
      senderId: currentAdmin.data._id,
      senderName: currentAdmin.data.fullName,
      senderRole: "admin",
      message: inputMessage,
      timestamp: new Date(),
      isRead: false,
    };

    socket.emit("send_message", {
      roomId: selectedRoom.roomId,
      senderId: currentAdmin.data._id,
      senderName: currentAdmin.data.fullName,
      senderRole: "admin",
      message: inputMessage,
    });

    // setSelectedRoom((prev) =>
    //   prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
    // );

    setChatRooms((prev) =>
      prev.map((room) =>
        room.roomId === selectedRoom.roomId
          ? {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: inputMessage,
              lastMessageTime: new Date(),
            }
          : room
      )
    );

    setInputMessage("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Chat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Danh sách cuộc trò chuyện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {chatRooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => selectRoom(room)}
                  className={`p-4 border-b cursor-pointer hover:bg-muted transition ${
                    selectedRoom?.roomId === room.roomId ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{room.userName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage || "Chưa có tin nhắn"}
                      </p>
                    </div>
                    {room.unreadCount.admin > 0 && (
                      <Badge variant="destructive">
                        {room.unreadCount.admin}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedRoom
                ? `Chat với ${selectedRoom.userName}`
                : "Chọn một cuộc trò chuyện"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              {selectedRoom ? (
                <div className="space-y-4">
                  <ScrollArea className="h-[500px] border rounded-lg p-4">
                    {selectedRoom.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${
                          msg.senderRole === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderRole === "admin"
                              ? "bg-brand-deep-pink text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {msg.senderName}
                          </p>
                          <p>{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Nhập tin nhắn..."
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || !isConnected}
                      className="bg-brand-deep-pink"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Chọn một cuộc trò chuyện để bắt đầu
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
