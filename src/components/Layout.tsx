import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ChatWidget } from "./ChatWidget";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};