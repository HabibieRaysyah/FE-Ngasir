import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { GoChevronDown } from "react-icons/go";
import { HiOutlineArchiveBox } from "react-icons/hi2";

export default function NavComp() {
  return (
    <Navbar
      fluid
      rounded
      style={{ backgroundColor: "transparent", padding: "10px 0px" }}
    >
      <NavbarBrand>
        <div className="borderLogo">
          <HiOutlineArchiveBox color="white" size={20} className="font-bold" />
        </div>
        <span
          className="text-white  text-xl font-bold"
          style={{ marginLeft: "7px" }}
        >
          NGASIR
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <div className="flex">
          <div style={{ marginRight: "15px" }}>
            <input
              id="email4"
              type="email"
              placeholder="Cari..."
              className="inputSearch"
              style={{
                padding: "5px",
                background: "#ffffff3b",
                borderRadius: "5px",
                border: "0px solid",
                color: "white",
              }}
            />
          </div>
          <div className="flex">
            <div className="avatar">
              <Avatar size="sm" rounded />
            </div>
            <GoChevronDown
              style={{ marginTop: "5px", marginLeft: "5px" }}
              size="25px"
              color="white"
            />
          </div>
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
