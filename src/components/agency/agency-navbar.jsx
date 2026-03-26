import {
  PanelRightOpen,
  PanelRightClose,
  Bell,
} from "lucide-react";
import profile from "../../assets/profile.png";

const AgencyNavbar = ({ isSidebarOpen, toggleSidebar, toggleMobile }) => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      
      {/* DESKTOP TOGGLE */}
      <div className="hidden md:block">
        {isSidebarOpen ? (
          <PanelRightOpen onClick={toggleSidebar} className="cursor-pointer" />
        ) : (
          <PanelRightClose onClick={toggleSidebar} className="cursor-pointer" />
        )}
      </div>

      {/* MOBILE TOGGLE */}
      <div className="md:hidden">
        <PanelRightOpen onClick={toggleMobile} className="cursor-pointer" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-7">
        <Bell className="cursor-pointer" />
        <div className="h-7 border border-gray-300"></div>

        <div className="flex items-center">
          <div className="text-end font-semibold">
            <p className="text-sm">7Span</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <img src={profile} width="50px" alt="profile" className="cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default AgencyNavbar;
