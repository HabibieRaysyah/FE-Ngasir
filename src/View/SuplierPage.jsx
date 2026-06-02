import { AgGridProvider, AgGridReact } from "ag-grid-react";
import AlertSuccess from "../Component/AlertSuccess";
import { config, animated, useTransition } from "react-spring";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiSolidBarcode } from "react-icons/bi";
import {
  Badge,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const modules = [AllCommunityModule];

export default function SuplierPage() {
  const [rowData, setRowData] = useState([]);
  const { id } = useParams();
  const [isSuccess, setIsSucess] = useState();
  const [succesMessage, setSuccessMessage] = useState("");
  const [cheked, setCheked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [formsData, setFormsData] = useState([
    {
      name: "",
      contact: "",
      phone: "",
      address: "",
      status: "",
    },
  ]);
  const [colDefs, setColDefs] = useState([
    { field: "name", headerName: "Nama Suplier" },
    { field: "contact", headerName: "Kontak" },
    { field: "phone", headerName: "Nomor HandPhone" },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => (
        <div className="flex p-2">
          {params.data.status == "Aktif" ? (
            <Badge>Aktif</Badge>
          ) : (
            <Badge color="red">Non-Aktif</Badge>
          )}
        </div>
      ),
    },
    {
      headerName: "Aksi",
      filter: false,
      maxWidth: 200,
      sortable: false,
      cellRenderer: (params) => (
        <div className="flex gap-3 p-1">
          <Button
            size="xs"
            color="yellow"
            onClick={() => {
              setOpenModalUpdate(true);
              setUpdateData(params.data);
            }}
          >
            <FaEdit />
          </Button>
          <Button
            color={"red"}
            size="xs"
            onClick={() => {
              setOpenModalDelete(true);
              setDeleteData(params.data);
            }}
          >
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ]);

  const handleGet = async () => {
    try {
      const res = await api.get(`/suplier/${id}`);
      console.log(res.data.data);
      setRowData(res.data.data);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const handlePost = async () => {
    try {
      const res = await api.post("/suplier", {
        store_id: id,
        name: formsData.name,
        contact: formsData.contact,
        phone: formsData.phone,
        status: formsData.status,
        address: formsData.address,
      });

      if (res) {
        console.log(res.data.data);
        handleGet();
        setFormsData([]);
        setIsSucess(true);
        setTimeout(() => {
          setIsSucess(false);
        }, 3000);
        setSuccessMessage("Berhasil Menambahkan Suplier");
        setOpenModal(false);
      }
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put("/suplier", {
        store_id: id,
        suplier_id: updateData.id,
        name: updateData.name,
        contact: updateData.contact,
        phone: updateData.phone,
        status: updateData.status,
        address: updateData.address,
      });

      console.log(res.data.data);
      setOpenModalUpdate(false);
      setIsSucess(true);
      setTimeout(() => {
        setIsSucess(false);
      }, 3000);
      setSuccessMessage("Berhasil Mengubah Suplier");
      handleGet();
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/suplier/${deleteData.id}`);

      console.log(res.data);
      setOpenModalDelete(false);
      setIsSucess(true);
      setTimeout(() => {
        setIsSucess(false);
      }, 3000);
      setSuccessMessage("Berhasil Menghapus Suplier");
      handleGet();
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const slideIn = useTransition(isSuccess, {
    from: { transform: "translateX(200%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(200%)", opacity: 0 },
    config: config.gentle,
  });

  useEffect(() => {
    handleGet();
  }, [id]);

  return (
    <div className="p-5">
      <div className="flex justify-end">
        <Button className="mb-5" onClick={() => setOpenModal(true)}>
          + Tambah Kategori
        </Button>
      </div>
      <AgGridProvider modules={modules}>
        <div style={{ height: "400px", minWidth: "900px" }}>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              sortable: true,
              filter: true,
            }}
            pagination
            rowData={rowData}
            columnDefs={colDefs}
          />
        </div>
      </AgGridProvider>

      <Modal
        dismissible
        show={openModal}
        size="lg"
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader>
          <div className="block">
            <h3>Menambahkan Supplier Baru</h3>
            <p className="text-sm text-gray-500">
              Lengkapi Informasi untuk Menambahkan Suplier baru
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Nama Suplier</Label>
              </div>
              <TextInput
                id="namasuplier"
                type="text"
                placeholder="Masukan nama suplier..."
                onChange={(e) =>
                  setFormsData({ ...formsData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="flex grid-cols-2 gap-16">
              <div>
                {" "}
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Nama Kontak</Label>
                </div>
                <TextInput
                  id="namasuplier"
                  type="text"
                  placeholder="Masukan nama kontak..."
                  onChange={(e) =>
                    setFormsData({ ...formsData, contact: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                {" "}
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Nomor HP</Label>
                </div>
                <TextInput
                  id="namasuplier"
                  type="number"
                  placeholder="Masukan Nomor Hp..."
                  onChange={(e) =>
                    setFormsData({ ...formsData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Alamat Suplier</Label>
              </div>
              <Textarea
                id="alamatsuplier"
                type="text"
                placeholder="Masukan Alamat Suplier..."
                onChange={(e) =>
                  setFormsData({ ...formsData, address: e.target.value })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Aktifkan Suplier</Label>
              </div>
              <ToggleSwitch
                checked={!cheked}
                onClick={() => {
                  setCheked(!cheked);
                  console.log(cheked);
                  if (cheked) {
                    setFormsData({
                      ...formsData,
                      status: "Aktif",
                    });
                  } else {
                    setFormsData({
                      ...formsData,
                      status: "Non-Aktif",
                    });
                  }
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
          <Button onClick={() => handlePost()}>Buat Kategori</Button>
        </ModalFooter>
      </Modal>

      <Modal
        dismissible
        show={openModalUpdate}
        size="lg"
        onClose={() => setOpenModalUpdate(false)}
      >
        <ModalHeader>
          <div className="block">
            <h3>Menambahkan Supplier Baru</h3>
            <p className="text-sm text-gray-500">
              Lengkapi Informasi untuk Menambahkan Suplier baru
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Nama Suplier</Label>
              </div>
              <TextInput
                id="namasuplier"
                type="text"
                value={updateData.name}
                placeholder="Masukan nama suplier..."
                onChange={(e) =>
                  setUpdateData({ ...updateData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="flex grid-cols-2 gap-16">
              <div>
                {" "}
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Nama Kontak</Label>
                </div>
                <TextInput
                  id="namasuplier"
                  type="text"
                  value={updateData.contact}
                  placeholder="Masukan nama kontak..."
                  onChange={(e) =>
                    setUpdateData({ ...updateData, contact: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                {" "}
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Nomor HP</Label>
                </div>
                <TextInput
                  id="namasuplier"
                  type="number"
                  value={updateData.phone}
                  placeholder="Masukan Nomor Hp..."
                  onChange={(e) =>
                    setUpdateData({ ...updateData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Alamat Suplier</Label>
              </div>
              <Textarea
                id="alamatsuplier"
                type="text"
                value={updateData.address}
                placeholder="Masukan Alamat Suplier..."
                onChange={(e) =>
                  setUpdateData({ ...updateData, address: e.target.value })
                }
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Aktifkan Suplier</Label>
              </div>
              <ToggleSwitch
                id="statussuplier"
                checked={updateData?.status === "Aktif"}
                onChange={(checked) => {
                  setUpdateData({
                    ...updateData,
                    status: checked ? "Aktif" : "Non-Aktif",
                  });
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
          <Button onClick={() => handleUpdate()}>Buat Kategori</Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={openModalDelete}
        size="md"
        onClose={() => setOpenModalDelete(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah kamu yakin untuk meng hapus Suplier ini?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => handleDelete()}>
                Ya
              </Button>
              <Button
                color="alternative"
                onClick={() => setOpenModalDelete(false)}
              >
                Tidak
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {slideIn(
        (style, item) =>
          item && (
            <div className="Alert">
              <animated.div style={style}>
                <AlertSuccess message={succesMessage} />
              </animated.div>
            </div>
          ),
      )}
    </div>
  );
}
