import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useContext, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";
import { useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import api from "../utils/api";

export default function SiderBarComp() {
  const [openModal, SetOpenModal] = useState(false);
  const {user} = useContext(UserContext);
  const [code, setCode] = useState("");


  function onCloseModal() {
    SetOpenModal(false);
    setCode("");
  }

    const joinByCode = async () => {
    const res = await api.post('/store/join', {
      user_id : user.id,
      code : code ,
    })
    console.log(res.data.dat)
    SetOpenModal(false);
    setCode("")
  }
  return (
    <div
      style={{
        height: "96.6vh",
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
        <div
          className="flex inactive cursor-pointer"
          onClick={() => SetOpenModal(true)}
        >
          <TiMessageTyping size="20px" />
          <p style={{ marginLeft: "15px" }}>Masuk Dengan Kode</p>
        </div>
      </div>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Masuk menggunakan Code
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Code Toko</Label>
              </div>
              <TextInput
                id="code"
                placeholder="Masuka Kode Toko"
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={() => joinByCode()}>Masuk</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
