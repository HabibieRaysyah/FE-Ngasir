import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { Badge, Alert, Card, Button, Select, Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const modules = [AllCommunityModule];

export default function StockPage() {
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const { id } = useParams();

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stockRange, setStockRange] = useState({ min: "", max: "" });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [colDefs] = useState([
    { field: "barcode", headerName: "Barcode", width: 150, filter: true },
    { field: "name", headerName: "Nama Produk", width: 200, filter: true },
    {
      field: "img",
      headerName: "Gambar",
      width: 100,
      cellRenderer: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">
            No img
          </div>
        ),
    },
    {
      field: "stock",
      headerName: "Stok",
      width: 100,
      cellRenderer: (params) => {
        const stock = params.value || 0;
        const minStock = params.data.min_stock || 0;
        if (stock <= minStock) {
          return <span className="text-red-600 font-bold">{stock}</span>;
        }
        return <span>{stock}</span>;
      },
    },
    { field: "min_stock", headerName: "Min Stok", width: 100 },
    {
      field: "selling_price",
      headerName: "Harga Jual",
      width: 150,
      cellRenderer: (params) =>
        `Rp ${Number(params.value).toLocaleString("id-ID")}`,
    },
    {
      field: "purchase_price",
      headerName: "Harga Beli",
      width: 150,
      cellRenderer: (params) =>
        `Rp ${Number(params.value).toLocaleString("id-ID")}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: (params) => (
        <div className="flex p-2">
          {params.value === true || params.value === 1 ? (
            <Badge color="success">Aktif</Badge>
          ) : (
            <Badge color="red">Non-Aktif</Badge>
          )}
        </div>
      ),
    },
    {
      field: "Categorie",
      headerName: "Kategori",
      width: 150,
      cellRenderer: (params) => params.value?.name || "-",
    },
    {
      field: "Suplier",
      headerName: "Suplier",
      width: 150,
      cellRenderer: (params) => params.value?.name || "-",
    },
  ]);

  const handleGet = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      console.log(res.data.data);
      setRowData(res.data.data);
      setOriginalRowData(res.data.data);

      // Extract unique categories and suppliers
      const uniqueCategories = [
        ...new Map(
          res.data.data
            .map((item) => [
              item.Categorie?.id,
              { id: item.Categorie?.id, name: item.Categorie?.name },
            ])
            .filter((item) => item[0]),
        ).values(),
      ];
      setCategories(uniqueCategories);

      const uniqueSuppliers = [
        ...new Map(
          res.data.data
            .map((item) => [
              item.Suplier?.id,
              { id: item.Suplier?.id, name: item.Suplier?.name },
            ])
            .filter((item) => item[0]),
        ).values(),
      ];
      setSuppliers(uniqueSuppliers);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  // Fungsi filter (menggunakan IF-ELSE)
  const applyFilter = () => {
    let filtered = [...originalRowData];

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.barcode?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter berdasarkan kategori
    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.Categorie?.id === parseInt(selectedCategory),
      );
    }

    // Filter berdasarkan supplier
    if (selectedSupplier) {
      filtered = filtered.filter(
        (item) => item.Suplier?.id === parseInt(selectedSupplier),
      );
    }

    // Filter berdasarkan status
    if (statusFilter !== "") {
      const isActive = statusFilter === "aktif";
      filtered = filtered.filter((item) => item.status === isActive);
    }

    // Filter berdasarkan range stok
    if (stockRange.min !== "") {
      filtered = filtered.filter(
        (item) => (item.stock || 0) >= parseInt(stockRange.min),
      );
    }
    if (stockRange.max !== "") {
      filtered = filtered.filter(
        (item) => (item.stock || 0) <= parseInt(stockRange.max),
      );
    }

    setRowData(filtered);
  };

  // Fungsi reset filter
  const resetFilter = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSupplier("");
    setStatusFilter("");
    setStockRange({ min: "", max: "" });
    setRowData(originalRowData);
  };

  // Hitung estimasi nilai stok
  const totalStockValue = rowData.reduce((sum, item) => {
    return sum + (item.purchase_price || 0) * (item.stock || 0);
  }, 0);

  // Hitung stok menipis
  const lowStockCount = rowData.filter(
    (item) => (item.stock || 0) <= (item.min_stock || 0),
  ).length;

  // Export ke Excel
  const exportToExcel = () => {
    const exportData = rowData.map((item) => ({
      Barcode: item.barcode || "-",
      "Nama Produk": item.name || "-",
      Stok: item.stock || 0,
      "Min Stok": item.min_stock || 0,
      "Harga Beli": `Rp ${(item.purchase_price || 0).toLocaleString("id-ID")}`,
      "Harga Jual": `Rp ${(item.selling_price || 0).toLocaleString("id-ID")}`,
      Status: item.status ? "Aktif" : "Non-Aktif",
      Kategori: item.Categorie?.name || "-",
      Supplier: item.Suplier?.name || "-",
    }));

    // Tambahan baris total
    exportData.push({
      Barcode: "TOTAL",
      "Nama Produk": `Nilai Stok: Rp ${totalStockValue.toLocaleString("id-ID")}`,
      Stok: "",
      "Min Stok": "",
      "Harga Beli": "",
      "Harga Jual": "",
      Status: "",
      Kategori: "",
      Supplier: "",
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Stok");
    XLSX.writeFile(
      wb,
      `laporan_stok_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  useEffect(() => {
    if (id) {
      handleGet();
    }
  }, [id]);

  const lowStockProducts = rowData.filter(
    (p) => (p.stock || 0) <= (p.min_stock || 0),
  );

  return (
    <div className="p-5 ">
      {lowStockProducts.length > 0 && (
        <Alert color="warning" className="mb-4 w-[100%]">
          <span className="font-medium">Perhatian!</span> Ada{" "}
          {lowStockProducts.length} produk dengan stok menipis (≤ min stok)
        </Alert>
      )}

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Laporan Stok</h2>
      </div>

      <div className="flex grid-cols-2 gap-10 mb-5">
        <Card className="w-[100%]">
          <p className="text-gray-500 text-sm">Estimasi Nilai Stok</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {totalStockValue.toLocaleString("id-ID")}
          </p>
        </Card>
        <Card className="w-[100%]">
          <p className="text-gray-500 text-sm">Stok Produk Menipis</p>
          <p
            className={`text-2xl font-bold ${lowStockCount > 0 ? "text-red-600" : "text-green-600"}`}
          >
            {lowStockCount}
          </p>
        </Card>
      </div>

      <AgGridProvider modules={modules}>
        <div style={{ height: "450px", minWidth: "100%" }}>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            rowData={rowData}
            columnDefs={colDefs}
            enableCellTextSelection={true}
          />
        </div>
      </AgGridProvider>
    </div>
  );
}
