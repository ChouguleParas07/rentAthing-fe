import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;