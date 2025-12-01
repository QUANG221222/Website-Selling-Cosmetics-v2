import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { models } from '~/models'
import { env } from '~/configs/enviroment'
import { ObjectId } from 'mongodb'
import { IMessage } from '~/models/chatModel'

let io: SocketIOServer

// Handle Socket.IO initialization and events
const handleJoinRoom = async (
  socket: any,
  data: {
    userId: string
    userName: string
    roomId: string
    userRole: 'customer' | 'admin'
  }
) => {
  try {
    let chatRoom =
      (await models.chatModel.findChatByRoomId(data.roomId)) ||
      (await models.chatModel.findChatByUserId(data.userId))

    if (!chatRoom) {
      const roomId = `room_${data.userId}_${Date.now()}`

      await models.chatModel.createChatRoom({
        roomId,
        userId: new ObjectId(data.userId),
        userName: data.userName,
        messages: [],
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        status: 'active'
      })

      chatRoom = await models.chatModel.findChatByRoomId(roomId)
    }

    socket.join(chatRoom!.roomId)

    // Mark as read when joining
    if (data.userRole === 'admin') {
      await models.chatModel.markAsRead(chatRoom!.roomId)
    }

    socket.emit('room_joined', {
      roomId: chatRoom!.roomId,
      messages: chatRoom!.messages.filter((m) => !m.isDeleted)
    })
  } catch (error) {
    console.error('Error joining room:', error)
    socket.emit('error', { message: 'Failed to join room' })
  }
}

const handleAdminJoinAll = async (socket: any) => {
  try {
    const allChats = await models.chatModel.getAllActiveChats()
    allChats.forEach((chat) => {
      socket.join(chat.roomId)
    })
    socket.emit('admin_rooms_joined', {
      chats: allChats.map((chat) => ({
        ...chat,
        messages: chat.messages.filter((m) => !m.isDeleted)
      }))
    })
  } catch (error) {
    console.error('❌ Error admin joining rooms:', error)
  }
}

const handleSendMessage = async (
  socket: any,
  data: {
    roomId: string
    senderId: string
    senderName: string
    senderRole: 'customer' | 'admin'
    message: string
  }
) => {
  try {
    const newMessage: IMessage = {
      _id: new ObjectId(),
      senderId: new ObjectId(data.senderId),
      senderName: data.senderName,
      senderRole: data.senderRole,
      message: data.message,
      timestamp: Date.now(),
      isRead: false,
      isDeleted: false
    }

    await models.chatModel.addMessage(data.roomId, newMessage)
    io.to(data.roomId).emit('receive_message', newMessage)

    if (data.senderRole === 'customer') {
      io.emit('new_customer_message', {
        roomId: data.roomId,
        message: newMessage
      })
    }
  } catch (error) {
    console.error('❌ Error sending message:', error)
    socket.emit('error', { message: 'Failed to send message' })
  }
}

const handleDeleteMessage = async (
  socket: any,
  data: { roomId: string; messageId: string }
) => {
  try {
    await models.chatModel.deleteMessage(data.roomId, data.messageId)
    io.to(data.roomId).emit('message_deleted', { messageId: data.messageId })
  } catch (error) {
    console.error('❌ Error deleting message:', error)
    socket.emit('error', { message: 'Failed to delete message' })
  }
}

const handleMarkAsRead = async (_socket: any, data: { roomId: string }) => {
  try {
    await models.chatModel.markAsRead(data.roomId)
    io.to(data.roomId).emit('messages_read', { roomId: data.roomId })
  } catch (error) {
    console.error('❌ Error marking as read:', error)
  }
}

// Setup events function
const setupSocketEvents = (socket: any) => {
  socket.on('join_room', (data: any) => handleJoinRoom(socket, data))
  socket.on('admin_join_all', () => handleAdminJoinAll(socket))
  socket.on('send_message', (data: any) => handleSendMessage(socket, data))
  socket.on('delete_message', (data: any) => handleDeleteMessage(socket, data))
  socket.on('mark_as_read', (data: any) => handleMarkAsRead(socket, data))
  // socket.on('disconnect', () => console.log('❌ User disconnected:', socket.id))
  socket.on('disconnect', () => {})
}

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin:
        env.BUILD_MODE === 'production'
          ? env.WEBSITE_DOMAIN_PRODUCTION
          : env.WEBSITE_DOMAIN_DEVELOPMENT,
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    // console.log('✅ User connected:', socket.id)
    setupSocketEvents(socket)
  })

  return io
}

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}
