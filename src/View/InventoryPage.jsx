  import { AgGridProvider, AgGridReact } from "ag-grid-react";
  import AlertSuccess from "../Component/AlertSuccess";
  import { config, animated, useTransition } from "react-spring";
  import { MdDelete } from "react-icons/md";
  import { FaEdit } from "react-icons/fa";
  import { BiSolidPackage, BiHistory } from "react-icons/bi";
  import {
    Badge,
    Button,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput,
    Textarea,
    Select,
    Datepicker,
    Alert,
  } from "flowbite-react";
  import { useEffect, useState } from "react";
  import { AllCommunityModule } from "ag-grid-community";
  import api from "../utils/api";
  import { useParams } from "react-router-dom";
  import { HiOutlineExclamationCircle } from "react-icons/hi";

  const modules = [AllCommunityModule];

  export default function InventoryPage() {
    const [rowData, setRowData] = useState([]);
    const { id } = useParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [updateData, setUpdateData] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentStock, setCurrentStock] = useState(0);
    const [newStockAfter, setNewStockAfter] = useState(0);

    const [formsData, setFormsData] = useState({
      store_id: id,
      product_id: "",
      type: "In",
      difference: "",
      stock: "",
      user_id: "",
      referensi: "",
      notes: "",
      date: new Date().toISOString().slice(0, 10),
    });

    const [colDefs] = useState([
      {
        field: "date",
        headerName: "Tanggal",
        width: 150,
        cellRenderer: (params) =>
          params.value ? new Date(params.value).toLocaleString("id-ID") : "-",
      },
      {
        field: "Product",
        headerName: "Produk",
        width: 200,
        cellRenderer: (params) => params.data.Product?.name || "-",
      },
      {
        field: "type",
        headerName: "Jenis",
        width: 100,
        cellRenderer: (params) => (
          <div className="flex p-2">
            {params.value === "In" ? (
              <Badge color="success">In</Badge>
            ) : (
              <Badge color="warning">Sale</Badge>
            )}
          </div>
        ),
      },
      {
        field: "difference",
        headerName: "Perubahan",
        width: 120,
        cellRenderer: (params) => (
          <span
            className={
              params.data?.type === "In"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {params.data?.type === "In" ? `+${params.value}` : `-${params.value}`}
          </span>
        ),
      },
      { field: "stock", headerName: "Stok Akhir", width: 120 },
      {
        field: "referensi",
        headerName: "Referensi",
        width: 150,
        cellRenderer: (params) => params.value || "-",
      },
      {
        field: "User",
        headerName: "User",
        width: 150,
        cellRenderer: (params) => params.value?.name || "-",
      },
      { field: "notes", headerName: "Catatan", width: 200 },
    ]);

    // Get current stock dari product yang dipilih
    const getCurrentStock = async (productId) => {
      try {
        // LO ISI ENDPOINT GET CURRENT STOCK
        const res = await api.get(`/product/stock/${productId}`);
        return res.data.data?.stock || 0;
      } catch (err) {
        console.log("Error get stock", err.message);
        return 0;
      }
    };

    const handleGet = async () => {
      try {
        const res = await api.get(`/inventory/${id}`);
        console.log(res.data.data);
        setRowData(res.data.data);
      } catch (err) {
        console.log("Server Error", err.message);
      }
    };

    const handlePost = async () => {
      try {
        if (
          formsData.type === "Sale" &&
          parseInt(formsData.difference) > currentStock
        ) {
          alert(`Stok tidak mencukupi! Stok saat ini: ${currentStock}`);
          return;
        }

        const dataToSend = {
          store_id: formsData.store_id,
          product_id: formsData.product_id,
          type: formsData.type,
          difference: parseInt(formsData.difference),
          stock: newStockAfter,
          user_id: formsData.user_id,
          referensi: formsData.referensi,
          notes: formsData.notes,
          date: formsData.date,
        };

        const res = await api.post(`${API_BASE}/inventory`, dataToSend);

        if (res) {
          console.log(res.data.data);
          handleGet();
          resetForm();
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
          setSuccessMessage("Berhasil Menambahkan Mutasi Stok");
          setOpenModal(false);
        }
      } catch (err) {
        console.log("Server Error", err.message);
      }
    };

    const handleUpdate = async () => {
      try {
        const dataToSend = {
          inventory_id: updateData.id,
          store_id: id,
          product_id: updateData.product_id,
          type: updateData.type,
          difference: parseInt(updateData.difference),
          stock: updateData.stock,
          user_id: updateData.user_id,
          referensi: updateData.referensi,
          notes: updateData.notes,
          date: updateData.date,
        };

        const res = await api.put(`${API_BASE}/inventory`, dataToSend);

        console.log(res.data.data);
        setOpenModalUpdate(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        setSuccessMessage("Berhasil Mengubah Mutasi Stok");
        handleGet();
        resetUpdateForm();
      } catch (err) {
        console.log("Server Error" + err.message);
      }
    };

    const handleDelete = async () => {
      try {
        const res = await api.delete(`${API_BASE}/inventory/${deleteData.id}`);

        console.log(res.data);
        setOpenModalDelete(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        setSuccessMessage("Berhasil Menghapus Mutasi Stok");
        handleGet();
      } catch (err) {
        console.log("Server Error" + err.message);
      }
    };

    useEffect(() => {
      const calculateStock = async () => {
        const productId = formsData.product_id;
        if (productId) {
          const current = await getCurrentStock(productId);
          setCurrentStock(current);

          const diff = parseInt(formsData.difference) || 0;
          if (formsData.type === "In") {
            setNewStockAfter(current + diff);
            setFormsData((prev) => ({ ...prev, stock: current + diff }));
          } else {
            setNewStockAfter(current - diff);
            setFormsData((prev) => ({ ...prev, stock: current - diff }));
          }
        }
      };

      calculateStock();
    }, [formsData.product_id, formsData.difference, formsData.type]);

    useEffect(() => {
      if (updateData.id) {
        const diff = parseInt(updateData.difference) || 0;
        let newStock = 0;

        if (updateData.type === "In") {
          newStock = parseInt(updateData.stock) - diff + diff;
        } else {
          newStock = parseInt(updateData.stock) + diff - diff;
        }

        setUpdateData((prev) => ({ ...prev, stock: newStock }));
      }
    }, [updateData.difference, updateData.type]);

    const resetForm = () => {
      setFormsData({
        store_id: id,
        product_id: "",
        type: "In",
        difference: "",
        stock: "",
        user_id: "",
        referensi: "",
        notes: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setCurrentStock(0);
      setNewStockAfter(0);
    };

    const resetUpdateForm = () => {
      setUpdateData([]);
      setCurrentStock(0);
    };

    const slideIn = useTransition(isSuccess, {
      from: { transform: "translateX(200%)", opacity: 0 },
      enter: { transform: "translateX(0%)", opacity: 1 },
      leave: { transform: "translateX(200%)", opacity: 0 },
      config: config.gentle,
    });

    // Summary statistik
    const totalStockIn = rowData
      .filter((i) => i.type === "In")
      .reduce((sum, i) => sum + (parseInt(i.difference) || 0), 0);
    const totalStockOut = rowData
      .filter((i) => i.type === "Sale")
      .reduce((sum, i) => sum + (parseInt(i.difference) || 0), 0);

    useEffect(() => {
      if (id) {
        handleGet();
      }
    }, [id]);

    return (
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold">History Mutasi Stok</h2>
            <p className="text-sm text-gray-500">
              Tracking semua perubahan stok produk
            </p>
          </div>
          <Button onClick={() => setOpenModal(true)}>+ Tambah Mutasi</Button>
        </div>

        <div className="flex grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 w-[100%]">
            <div className="flex items-center gap-3">
              <BiSolidPackage className="text-green-600 text-2xl" />
              <div>
                <p className="text-sm text-green-600">Total Stok Masuk</p>
                <p className="text-2xl font-bold text-green-700">
                  {totalStockIn.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 w-[100%]">
            <div className="flex items-center gap-3">
              <BiHistory className="text-red-600 text-2xl" />
              <div>
                <p className="text-sm text-red-600">Total Stok Keluar</p>
                <p className="text-2xl font-bold text-red-700">
                  {totalStockOut.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-[100%]">
            <div className="flex items-center gap-3">
              <BiSolidPackage className="text-blue-600 text-2xl" />
              <div>
                <p className="text-sm text-blue-600">Total Mutasi</p>
                <p className="text-2xl font-bold text-blue-700">
                  {rowData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AgGridProvider modules={modules}>
          <div style={{ height: "400px", minWidth: "100%" }}>
            <AgGridReact
              defaultColDef={{
                flex: 1,
                sortable: true,
                filter: true,
              }}
              pagination
              paginationPageSize={20}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={{ flex: 1 }}
            />
          </div>
        </AgGridProvider>

        <Modal
          dismissible
          show={openModal}
          size="2xl"
          onClose={() => {
            setOpenModal(false);
            resetForm();
          }}
        >
          <ModalHeader>
            <div className="block">
              <h3>Tambah Mutasi Stok</h3>
              <p className="text-sm text-gray-500">
                Catat perubahan stok masuk atau keluar
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="product_id">Pilih Produk</Label>
                  </div>
                  <Select
                    id="product_id"
                    value={formsData.product_id}
                    onChange={(e) =>
                      setFormsData({ ...formsData, product_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Pilih Produk</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (Stok: {prod.stock})
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="w-40">
                  <div className="mb-2 block">
                    <Label>Stok Saat Ini</Label>
                  </div>
                  <TextInput
                    type="text"
                    readOnly
                    value={currentStock}
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="type">Jenis Mutasi</Label>
                  </div>
                  <Select
                    id="type"
                    value={formsData.type}
                    onChange={(e) =>
                      setFormsData({ ...formsData, type: e.target.value })
                    }
                  >
                    <option value="In">Stok Masuk (Pembelian)</option>
                    <option value="Sale">Stok Keluar (Penjualan)</option>
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="difference">Jumlah Perubahan</Label>
                  </div>
                  <TextInput
                    id="difference"
                    type="number"
                    placeholder="Jumlah..."
                    value={formsData.difference}
                    onChange={(e) =>
                      setFormsData({ ...formsData, difference: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="stock">Stok Akhir</Label>
                  </div>
                  <TextInput
                    id="stock"
                    type="text"
                    readOnly
                    value={newStockAfter}
                    className="bg-gray-100 font-semibold"
                  />
                  {formsData.type === "Sale" && newStockAfter < 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      Stok tidak mencukupi!
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="user_id">User / Kasir</Label>
                  </div>
                  <Select
                    id="user_id"
                    value={formsData.user_id}
                    onChange={(e) =>
                      setFormsData({ ...formsData, user_id: e.target.value })
                    }
                  >
                    <option value="">Pilih User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="referensi">Referensi</Label>
                  </div>
                  <TextInput
                    id="referensi"
                    type="text"
                    placeholder="No. Invoice / Nota / PO..."
                    value={formsData.referensi}
                    onChange={(e) =>
                      setFormsData({ ...formsData, referensi: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="date">Tanggal</Label>
                  </div>
                  <TextInput
                    id="date"
                    type="date"
                    value={formsData.date}
                    onChange={(e) =>
                      setFormsData({ ...formsData, date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                </div>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan..."
                  value={formsData.notes}
                  onChange={(e) =>
                    setFormsData({ ...formsData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {formsData.type === "Sale" && newStockAfter < 0 && (
                <Alert color="failure">
                  <span className="font-medium">Error!</span> Stok tidak mencukupi
                  untuk transaksi ini!
                </Alert>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button
              color="alternative"
              onClick={() => {
                setOpenModal(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handlePost}
              disabled={formsData.type === "Sale" && newStockAfter < 0}
              gradientDuoTone="purpleToBlue"
            >
              Simpan Mutasi
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          dismissible
          show={openModalUpdate}
          size="2xl"
          onClose={() => {
            setOpenModalUpdate(false);
            resetUpdateForm();
          }}
        >
          <ModalHeader>
            <div className="block">
              <h3>Edit Mutasi Stok</h3>
              <p className="text-sm text-gray-500">Ubah data mutasi stok</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_product_id">Produk</Label>
                  </div>
                  <Select
                    id="edit_product_id"
                    value={updateData.product_id || ""}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, product_id: e.target.value })
                    }
                  >
                    <option value="">Pilih Produk</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_type">Jenis Mutasi</Label>
                  </div>
                  <Select
                    id="edit_type"
                    value={updateData.type || "In"}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, type: e.target.value })
                    }
                  >
                    <option value="In">Stok Masuk</option>
                    <option value="Sale">Stok Keluar (Sale)</option>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_difference">Jumlah Perubahan</Label>
                  </div>
                  <TextInput
                    id="edit_difference"
                    type="number"
                    value={updateData.difference || ""}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, difference: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_stock">Stok Akhir</Label>
                  </div>
                  <TextInput
                    id="edit_stock"
                    type="number"
                    value={updateData.stock || ""}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, stock: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_user_id">User</Label>
                  </div>
                  <Select
                    id="edit_user_id"
                    value={updateData.user_id || ""}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, user_id: e.target.value })
                    }
                  >
                    <option value="">Pilih User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="mb-2 block">
                    <Label htmlFor="edit_referensi">Referensi</Label>
                  </div>
                  <TextInput
                    id="edit_referensi"
                    type="text"
                    value={updateData.referensi || ""}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, referensi: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="edit_date">Tanggal</Label>
                </div>
                <TextInput
                  id="edit_date"
                  type="date"
                  value={
                    updateData.date
                      ? new Date(updateData.date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setUpdateData({ ...updateData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="edit_notes">Catatan</Label>
                </div>
                <Textarea
                  id="edit_notes"
                  value={updateData.notes || ""}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button
              color="alternative"
              onClick={() => {
                setOpenModalUpdate(false);
                resetUpdateForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpdate}>Update Mutasi</Button>
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
                Apakah kamu yakin ingin menghapus mutasi ini?
              </h3>
              <p className="mb-5 text-sm text-gray-400">
                {deleteData.type === "In" ? "Stok Masuk" : "Stok Keluar"} |
                Perubahan: {deleteData.difference} | Stok Akhir:{" "}
                {deleteData.stock}
              </p>
              <div className="flex justify-center gap-4">
                <Button color="red" onClick={() => handleDelete()}>
                  Ya, Hapus
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

        {/* ALERT SUCCESS */}
        {slideIn(
          (style, item) =>
            item && (
              <div className="Alert">
                <animated.div style={style}>
                  <AlertSuccess message={successMessage} />
                </animated.div>
              </div>
            ),
        )}
      </div>
    );
  }
