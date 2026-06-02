import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";

export default function NavbarDashboardComp() {
  return (
    <Navbar fluid rounded className="fixed top-0 left-0 w-full bg-white z-50">
      <NavbarBrand className="gap-5">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          NGASIR
        </span>
        <div className="max-w-sm">
          <TextInput
            id="email4"
            type="email"
            icon={HiSearch}
            placeholder="Cari apapun..."
            color="white"
            required
          />
        </div>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse></NavbarCollapse>
    </Navbar>
  );
}
