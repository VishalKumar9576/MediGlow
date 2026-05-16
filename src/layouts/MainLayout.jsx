import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="bg-gray-200">
      <div className="min-h-screen mx-auto max-w-7xl bg-white">
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
        <ChatWidget />
      </div>
    </div>
  );
}

export default MainLayout;
