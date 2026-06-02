import { FaRegStar } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";

export default function SiderBarComp() {
  return (
    <div
      style={{
        height: "100vh",
        width: "330px",
        backgroundColor: "#f8f8f8",
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        padding: "20px 30px",
        borderRight: "1px solid #dedede",
      }}
    >
      <div className="flex borderLog shadow-2xl">
        <div className="borderLogoInitial">NR</div>
        <div className="block" style={{ marginLeft: "10px" }}>
          <p className="font-bold">NGASIR Main</p>
          <p style={{ fontSize: "12px", color: "#a1a1a1" }}>ENTERPRISE PLAN</p>
        </div>
      </div>

      <div className="block " style={{ marginTop: "40px" }}>
        <div className="flex active das-item">
          <IoHomeOutline size="20px" />
          <p style={{ marginLeft: "15px" }}>Daftar Toko</p>
        </div>
        <div className="flex inactive ">
          <TiMessageTyping size="20px" />
          <p style={{ marginLeft: "15px" }}>Masuk Dengan Kode</p>
        </div>
        <div className="flex inactive ">
          <MdOutlineCreateNewFolder size="20px" />
          <p style={{ marginLeft: "15px" }}>Daftar Toko</p>
        </div>
      </div>

      <hr style={{ marginTop: "50px", color: "#dddddd" }} />

      <div className="block " style={{ marginTop: "20px" }}>
        <div className="flex inactive ">
          <FaRegStar size="20px" />
          <p style={{ marginLeft: "15px" }}>Masuk Dengan Kode</p>
        </div>
      </div>
    </div>
  );
}
