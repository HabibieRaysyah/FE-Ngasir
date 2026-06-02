import { Outlet } from "react-router-dom";
import NavbarDashboardComp from "../Component/NavbarDashboardComp";
import SidebarDashComp from "../Component/SidebarDashComp";
import "../style/styleDashboardPageTemp.css";

export default function DashboardPageTemp() {
  return (
    <div className="dashboard">
      <NavbarDashboardComp />

      <div className="flex" style={{marginTop: "60px"}}>
        <SidebarDashComp />
        <div className="w-full " >
            <Outlet/>
        </div>
      </div>
    </div>
  );
}
