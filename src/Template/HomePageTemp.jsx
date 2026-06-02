import { Card } from "flowbite-react";
import NavComp from "../Component/NavComp";
import "../style/StyleHomePageTemp.css";
import SiderBarComp from "../Component/SideBarComp";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function HomePageTemp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      setUser(decoded);
    }
  }, []);
  return (
    <div style={{ padding: "0px 30px" }} className="bg-[#0061FF]">
      <div className=" h-70">
        <header>
          {" "}
          <NavComp />
          <div style={{ marginTop: "20px" }}>
            <h1 className="font-bold text-2xl text-white ">
              Selamat Datang {user?.name}
            </h1>
            <p
              className="font-semibold text-white"
              style={{ fontSize: "14px" }}
            >
              Kelola semua operasional cabang retail dan coffe shop anda dalam
              satu tempat
            </p>
          </div>
        </header>
        <main>
          <div className="h-150 shadow-2xl " style={{ marginTop: "30px" , backgroundColor: "white", borderRadius:"10px" }}>
            <div className="flex">
              <div>
                <SiderBarComp />
              </div>
              <div className="w-full">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
        <footer style={{ paddingTop: "50px", color: "#757682" }}>
          <div
            className="flex justify-between "
            style={{ padding: "20px 0px" }}
          >
            <p style={{ fontSize: "12px" }}>
              © 2026 NGASIR Managment System. All rights reserved.
            </p>
            <div className="flex" style={{ fontSize: "12px" }}>
              <p>Pusat Bantuan</p>
              <p style={{ padding: "0px 10px" }}>Syarat Ketentuan</p>
              <p>API docs</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
