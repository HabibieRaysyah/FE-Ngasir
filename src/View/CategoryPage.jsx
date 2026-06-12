import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useEffect, useState } from "react";

import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import {
  Badge,
  Button,
  FileInput,
  HelperText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import AlertSuccess from "../Component/AlertSuccess";
import { config, animated, useTransition } from "react-spring";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdOutlineDelete } from "react-icons/md";
import { FaEdit, FaRegEdit } from "react-icons/fa";

const modules = [AllCommunityModule];

export default function CategoryPage() {
  const { id } = useParams();

  const [rowData, setRowData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isSuccess, setIsSucess] = useState();
  const [switch1, setSwitch1] = useState(false);
  const [name, setName] = useState();

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "name" },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      maxWidth: 200,
      sortable: true,
      // Membuat tombol hapus di dalam tabel
      cellRenderer: (params) => (
        <div className="flex p-2">
          {params.data.status == 1 ? (
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
      // Membuat tombol hapus di dalam tabel
      cellRenderer: (params) => (
        <div className="flex gap-3 p-1">
          <Button size="xs" color="yellow" onClick={() => handleOpenModalUpdate(params)}>
            <FaEdit />
          </Button>
          <Button
            color={"red"}
            size="xs"
            onClick={() => {
              handleOpenModalDelete(params);
            }}
          >
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ]);

  const handleGetCategory = async () => {
    try {
      const res = await api.get(`/categorie/${id}`);

      setRowData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const data = {
        store_id: id,
        name: name,
        status: switch1,
      };
      const res = await api.post(`/categorie`, data);

      setIsSucess(true);
      setOpenModal(false);
      handleGetCategory();
      console.log(res);
      setTimeout(() => {
        setIsSucess(false);
      }, 3000);
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        store_id: Number(id),
        categorie_id: Number(updateData.id),
        name: updateData.name,
        status: updateData.status,
      };
      const res = await api.put("/categorie", data);

      if (res) {
        setUpdateData([]);
        setOpenModalUpdate(false);
        handleGetCategory();
      }
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/categorie/${deleteData.id}`);

      if (res) {
        setOpenModalDelete(false);
        setDeleteData([]);
        setIsSucess(true);
        handleGetCategory();

        setTimeout(() => {
          setTimeout(false);
        }, 3000);
      }
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

  const handleOpenModalUpdate = (params) => {
    console.log(params.data);
    setUpdateData(params.data);
    console.log(updateData);

    setOpenModalUpdate(true);
  };

  const handleOpenModalDelete = (params) => {
    console.log(params.data);
    setDeleteData(params.data);
    console.log(deleteData);

    setOpenModalDelete(true);
  };

  useEffect(() => {
    handleGetCategory();
  }, [id]);

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Kategori</p>
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
            <h3>Buat Kategori Baru</h3>
            <p className="text-sm text-gray-500">
              Lengkapi Informasi untuk membuat Kategori baru
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Nama Kategori</Label>
              </div>
              <TextInput
                id="namatoko"
                type="text"
                placeholder="Masukan nama toko..."
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Aktifkan Categori</Label>
              </div>
              <ToggleSwitch
                checked={switch1}
                onChange={() => setSwitch1(switch1 == true ? false : true)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
          <Button onClick={() => handleCreateCategory()}>Buat Kategori</Button>
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
            <h3>Mengubah Kategori</h3>
            <p className="text-sm text-gray-500">
              Lengkapi Informasi untuk mengubah Kategori 
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Nama Kategori</Label>
              </div>
              <TextInput
                id="namatoko"
                type="text"
                placeholder="Masukan nama kategori..."
                onChange={(e) =>
                  setUpdateData({ ...updateData, name: e.target.value })
                }
                required
                value={updateData.name}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Aktifkan Categori</Label>
              </div>
              <ToggleSwitch
                checked={updateData.status}
                onChange={() =>
                  setUpdateData(
                    updateData?.status
                      ? { ...updateData, status: false }
                      : { ...updateData, status: true },
                  )
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button color="alternative" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
          <Button onClick={() => handleUpdate()}>Ubah Kategori</Button>
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
              Apakah kamu yakin untuk meng hapus kategori ini?
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
                <AlertSuccess message="Berhasil Menambahkann Toko" />
              </animated.div>
            </div>
          ),
      )}
    </div>
  );
}
