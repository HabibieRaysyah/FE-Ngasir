import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { BsBox2, BsClipboard2Data } from "react-icons/bs";
import { CiDeliveryTruck, CiShoppingTag } from "react-icons/ci";
import { FaRegChartBar } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { LuBoxes, LuLayoutDashboard } from "react-icons/lu";
import { PiCashRegister } from "react-icons/pi";
import { Link, useLocation, useParams } from "react-router-dom";

export default function SidebarDashComp() {
  const customSidebarTheme = {
    root: {
      base: "h-full bg-[#f8fafc]", // Ubah warna background di sini
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded bg-[#f8fafc] py-4 px-3 dark:bg-[#f8fafc]",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal",
      active:
        "bg-white text-[#2563eb] hover:bg-[#f3f3f3] dark:bg-white shadow-sm",
      inactive:
        "text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
      icon: {
        base: "h-6 w-6 flex-shrink-0 transition duration-75",
        active: "text-[#2563eb] dark:text-[#2563eb]", // Warna ikon saat ACTIVE
        inactive: "text-gray-500 group-hover:text-gray-900 dark:text-gray-400", // Warna ikon saat INACTIVE
      },
    },
  };

  const { id } = useParams();

  const location = useLocation();
  const current = location.pathname;

  const isDashboard = current == `/dashboard/${id}`;
  const isPostCashier = current == `/dashboard/${id}/postcashier`;
  const isCategory = current == `/dashboard/${id}/category`;
  const isProduct = current == `/dashboard/${id}/product`;
  const isSuplier = current == `/dashboard/${id}/suplier`;
  const isInventory = current == `/dashboard/${id}/inventory`;
  const isTransaction = current == `/dashboard/${id}/transaction`;
  const isTransactionItem = current == `/dashboard/${id}/transactionitems`;
  const isStock = current == `/dashboard/${id}/stock`;

  return (
    <Sidebar
      className="border-r-stone-100"
      aria-label="Sidebar with logo branding example"
      style={{
        height: "90vh",
        borderRight: "1px solid #dedede",
        width: "220px",
      }}
      theme={customSidebarTheme}
    >
      <SidebarItems>
        <SidebarItemGroup>
          <div>
            <p className="text-[#2563eb] text-lg font-bold">Main Branch</p>
            <p className="text-[#475569] text-sm">Admin terminal</p>
          </div>
          <div className="mb-5">
            <p style={{ fontSize: "12px", color: "#7e7e7e" }}>Halaman Utama</p>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}`}
              icon={LuLayoutDashboard}
              active={isDashboard}
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/postcashier`}
              icon={PiCashRegister}
              active={isPostCashier}
            >
              Post Kasir
            </SidebarItem>
          </div>
          <div className="mb-5">
            <p style={{ fontSize: "12px", color: "#7e7e7e" }}>Data Utama</p>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/category`}
              icon={CiShoppingTag}
              active={isCategory}
            >
              Kategori
            </SidebarItem>{" "}
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/suplier`}
              icon={CiDeliveryTruck}
              active={isSuplier}
            >
              Suplier
            </SidebarItem>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/product`}
              icon={BsBox2}
              active={isProduct}
            >
              Produk
            </SidebarItem>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/inventory`}
              icon={BsClipboard2Data}
              active={isInventory}
            >
              Inventaris
            </SidebarItem>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#7e7e7e" }}>Laporan</p>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/transaction`}
              icon={FaRegChartBar}
              active={isTransaction}
            >
              Penjualan
            </SidebarItem>{" "}
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/transactionitems`}
              icon={IoStatsChartOutline}
              active={isTransactionItem}
            >
              Per Produk
            </SidebarItem>
            <SidebarItem
              as={Link}
              to={`/dashboard/${id}/stock`}
              icon={LuBoxes}
              active={isStock}
            >
              Stok
            </SidebarItem>
          </div>
          {/* <div>
            <p style={{ fontSize: "12px", color: "#7e7e7e" }}>
              Pegawai & Kasir
            </p>
            <SidebarItem href="#" icon={ImProfile}>
              Pegawai
            </SidebarItem>
          </div> */}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
