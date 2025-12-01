import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HomePage from "@/components/layout/Homepage";
import ChatWidget from "@/components/socket/ChatWidget";
import { SocketProvider } from "@/lib/socket/SocketContext";

export default function Home() {
  return (
    <SocketProvider>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
      <ChatWidget />
    </SocketProvider>
  );
}
