import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { useEffect, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
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
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import AlertSuccess from "../Component/AlertSuccess";
import { config, animated, useTransition } from "react-spring";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiSolidBarcode } from "react-icons/bi";

const modules = [AllCommunityModule];

export default function ProductPage() {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [categorie, setCategorie] = useState([]);
  const navigate = useNavigate();
  const [formProducts, setFormProducts] = useState([
    {
      category_id: "",
      name: "",
      price: "",
      stock: "",
      image: "",
      status: true,
    },
  ]);
  const [isSuccess, setIsSucess] = useState();
  const [rowData, setRowData] = useState([]);
  const formatRupiah = (angka) => {
    const formatRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

    return formatRupiah;
  };
  const [colDefs, setColDefs] = useState([
    {
      headerName: "Image",
      filter: false,
      maxWidth: 80,
      sortable: false,
      // Membuat tombol hapus di dalam tabel
      cellRenderer: (params) => (
        <div className="flex gap-3">
          <img src={params.data.img} className="w-10 h-auto" />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Nama Produk",
    },
    {
      headerName: "Kategori",
      maxWidth: 120,
      field: "category_id",
      cellRenderer: (params) => (
        <div className="flex p-2">
          <Badge>{params.data.Categorie.name}</Badge>
        </div>
      ),
    },
    { field: "stock", headerName: "Stok", maxWidth: 80 },
    {
      field: "price",
      maxWidth: 120,
      headerName: "Harga",
      cellRenderer: (params) => <p>{formatRupiah(params.data.price)}</p>,
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 120,

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
      sortable: false,
      maxWidth: 270,
      cellRenderer: (params) => (
        <div className=" flex gap-2 p-1">
          <Button
            size="xs"
            onClick={() =>
              navigate(
                `/dashboard/${id}/product/${params.data.barcode}/barcode`,
              )
            }
          >
            <BiSolidBarcode />
          </Button>
          <Button size="xs" color="yellow">
            <FaEdit />
          </Button>
          <Button size="xs" color="red">
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ]);

  const handleGet = async () => {
    try {
      const res = await api.get(`/product/${id}`);

      setRowData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log("Server Error " + err.message);
    }
  };

  const handlePost = async () => {
    try {
      if (formProducts) {
        const formData = new FormData();

        formData.append("store_id", id);
        formData.append("category_id", formProducts.category_id);
        formData.append("name", formProducts.name);
        formData.append("price", formProducts.price);
        formData.append("stock", formProducts.stock);
        formData.append("status", formProducts.status);
        formData.append("img", formProducts.image);
        console.log(formProducts);

        const res = await api.post("/product", formData);

        setOpenModal(false);
        setIsSucess(true);
        setTimeout(() => {
          setIsSucess(false);
        }, 3000);
        handleGet();
      } else {
        console.log("isi lebih lengkap lagi");
      }
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const getCategorie = async () => {
    try {
      const res = await api.get(`categorie/${id}`);

      setCategorie(res.data.data);
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
    getCategorie();
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
            <h3>Buat Product Baru</h3>
            <p className="text-sm text-gray-500">
              Lengkapi Informasi untuk membuat Kategori baru
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Nama Produk</Label>
              </div>
              <TextInput
                id="namaproduk"
                type="text"
                placeholder="Masukan nama product..."
                onChange={(e) =>
                  setFormProducts({ ...formProducts, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid-cols-2 flex gap-20">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Stock</Label>
                </div>
                <TextInput
                  id="namaproduk"
                  type="number"
                  placeholder="Masukan stock..."
                  onChange={(e) =>
                    setFormProducts({ ...formProducts, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="countries">Kategori</Label>
                </div>
                <Select
                  id="countries"
                  className="w-40"
                  onClick={(e) =>
                    setFormProducts({
                      ...formProducts,
                      category_id: e.target.value,
                    })
                  }
                  required
                >
                  <option selected disabled hidden>
                    Pilih Kategori
                  </option>
                  {categorie.map((cat, index) => (
                    <option key={index} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">harga</Label>
              </div>
              <TextInput
                id="harga"
                type="number"
                placeholder="Masukan harga..."
                onChange={(e) =>
                  setFormProducts({ ...formProducts, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                Upload Foto
              </Label>
              <FileInput
                id="file-upload-helper-text"
                onChange={(e) =>
                  setFormProducts({ ...formProducts, image: e.target.files[0] })
                }
              />
              <HelperText className="mt-1">
                SVG, PNG, JPG or GIF (MAX. 800x400px).
              </HelperText>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="namatoko">Aktifkan Categori</Label>
              </div>
              <ToggleSwitch
                checked={formProducts.status ?? false}
                onChange={(checked) =>
                  setFormProducts({
                    ...formProducts,
                    status: checked,
                  })
                }
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
          <Button onClick={() => handlePost()}>Buat Produk</Button>
        </ModalFooter>
      </Modal>

      {/* <Modal
          dismissible
          show={openModalUpdate}
          size="lg"
          onClose={() => setOpenModalUpdate(false)}
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
        </Modal> */}

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
