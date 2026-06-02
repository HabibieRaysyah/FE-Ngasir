import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { Button, Card, Datepicker, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const modules = [AllCommunityModule];

export default function TransactionItemPage() {
  const [rowData, setRowData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState([]);
  const { id } = useParams();

  // State untuk filter
  const [periode, setPeriode] = useState("");
  const [tanggalAcuan, setTanggalAcuan] = useState(null);
  const [dariTanggal, setDariTanggal] = useState(null);
  const [sampaiTanggal, setSampaiTanggal] = useState(null);

  const [colDefs] = useState([
    {
      field: "product_id",
      headerName: "Produk",
      width: 100,
      cellRenderer: (params) => <p>{params.data.Product?.name || "-"}</p>,
    },
    { field: "quantity", headerName: "Jumlah", width: 100 },
    {
      field: "price",
      headerName: "Omzet",
      width: 150,
      cellRenderer: (params) => {
        const omset =
          Number(params.data.Product?.selling_price || 0) *
          Number(params.data.quantity || 0);

        return `Rp ${Number(omset).toLocaleString("id-ID")}`;
      },
    },
    {
      field: "price",
      headerName: "Profit Kotor",
      width: 150,
      cellRenderer: (params) => {
        const omset =
          Number(params.data.Product?.selling_price || 0) *
          Number(params.data.quantity || 0);
        const kuantitasTerjual = Number(params.data.quantity) || 0;

        const hargaBeliPerUnit =
          Number(params.data.Product?.purchase_price) || 0;
        const totalHpp = hargaBeliPerUnit * kuantitasTerjual;
        const profitKotor = omset - totalHpp;

        return `Rp ${profitKotor.toLocaleString("id-ID")}`;
      },
    },
    {
      field: "createdAt",
      headerName: "Dibuat Pada",
      width: 180,
      cellRenderer: (params) =>
        params.value ? new Date(params.value).toLocaleString("id-ID") : "-",
    },
  ]);

  const handleGet = async () => {
    try {
      const res = await api.get(`/transitems/${id}`);
      console.log(res.data.data);
      setRowData(res.data.data);
      setOriginalRowData(res.data.data);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  // Fungsi filter menggunakan IF-ELSE
  const applyFilter = () => {
    let filtered = [...originalRowData];

    // Filter berdasarkan periode
    if (periode) {
      const now = new Date();
      const startDate = new Date();

      if (periode === "hari ini") {
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate;
        });
      } else if (periode === "minggu ini") {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;
        startDate.setDate(now.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate;
        });
      } else if (periode === "bulan ini") {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate;
        });
      } else if (periode === "tahun ini") {
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate;
        });
      }
    }

    // Filter berdasarkan tanggal acuan
    if (tanggalAcuan) {
      const selectedDate = new Date(tanggalAcuan);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= selectedDate && itemDate < nextDay;
      });
    }

    // Filter berdasarkan dari tanggal - sampai tanggal
    if (dariTanggal && sampaiTanggal) {
      const start = new Date(dariTanggal);
      start.setHours(0, 0, 0, 0);
      const end = new Date(sampaiTanggal);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    } else if (dariTanggal) {
      const start = new Date(dariTanggal);
      start.setHours(0, 0, 0, 0);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= start;
      });
    } else if (sampaiTanggal) {
      const end = new Date(sampaiTanggal);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate <= end;
      });
    }

    setRowData(filtered);
  };

  // Fungsi reset filter
  const resetFilter = () => {
    setPeriode("");
    setTanggalAcuan(null);
    setDariTanggal(null);
    setSampaiTanggal(null);
    setRowData(originalRowData);
  };

  // Fungsi export ke Excel
  const exportToExcel = () => {
    const exportData = rowData.map((item) => ({
      Produk: item.Product?.name || "-",
      Jumlah: item.quantity || 0,
      Omzet: `Rp ${(Number(item.Product?.selling_price || 0) * Number(item.quantity || 0)).toLocaleString("id-ID")}`,
      "Profit Kotor": `Rp ${(() => {
        const omset =
          Number(item.Product?.selling_price || 0) * Number(item.quantity || 0);
        const totalHpp =
          (Number(item.Product?.purchase_price) || 0) *
          (Number(item.quantity) || 0);
        return (omset - totalHpp).toLocaleString("id-ID");
      })()}`,
      "Dibuat Pada": item.createdAt
        ? new Date(item.createdAt).toLocaleString("id-ID")
        : "-",
    }));

    // Hitung total
    const totalOmzet = rowData.reduce((sum, item) => {
      return (
        sum +
        Number(item.Product?.selling_price || 0) * Number(item.quantity || 0)
      );
    }, 0);

    const totalProfit = rowData.reduce((sum, item) => {
      const omset =
        Number(item.Product?.selling_price || 0) * Number(item.quantity || 0);
      const totalHpp =
        (Number(item.Product?.purchase_price) || 0) *
        (Number(item.quantity) || 0);
      return sum + (omset - totalHpp);
    }, 0);

    const totalQuantity = rowData.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );

    exportData.push({
      Produk: "TOTAL",
      Jumlah: totalQuantity,
      Omzet: `Rp ${totalOmzet.toLocaleString("id-ID")}`,
      "Profit Kotor": `Rp ${totalProfit.toLocaleString("id-ID")}`,
      "Dibuat Pada": "",
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 30 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaction Items");
    XLSX.writeFile(
      wb,
      `transaction_items_${id}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // Hitung total untuk summary card
  const totalOmzet = rowData.reduce((sum, item) => {
    return (
      sum +
      Number(item.Product?.selling_price || 0) * Number(item.quantity || 0)
    );
  }, 0);

  const totalProfit = rowData.reduce((sum, item) => {
    const omset =
      Number(item.Product?.selling_price || 0) * Number(item.quantity || 0);
    const totalHpp =
      (Number(item.Product?.purchase_price) || 0) *
      (Number(item.quantity) || 0);
    return sum + (omset - totalHpp);
  }, 0);

  const totalQuantity = rowData.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  useEffect(() => {
    if (id) {
      handleGet();
    }
  }, [id]);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-2xl font-bold">Item Transaksi</h2>
        </div>
      </div>
      <div className="mb-5">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <label htmlFor="periode">Periode</label>
              <Select
                className="w-full"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="">== Pilih Periode ==</option>
                <option value="hari ini">Hari Ini</option>
                <option value="minggu ini">Minggu Ini</option>
                <option value="bulan ini">Bulan Ini</option>
                <option value="tahun ini">Tahun Ini</option>
              </Select>
            </div>
            <div className="w-full">
              <label htmlFor="tanggalAcuan">Tanggal Acuan</label>
              <Datepicker
                value={tanggalAcuan}
                onChange={(date) => setTanggalAcuan(date)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="dariTanggal">Dari</label>
              <Datepicker
                value={dariTanggal}
                onChange={(date) => setDariTanggal(date)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="sampaiTanggal">Sampai</label>
              <Datepicker
                value={sampaiTanggal}
                onChange={(date) => setSampaiTanggal(date)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button color="blue" onClick={applyFilter}>
              Terapkan Filter
            </Button>
            <Button color="blue" outline onClick={resetFilter}>
              Reset
            </Button>
            <Button color="blue" outline onClick={exportToExcel}>
              Export Excel
            </Button>
          </div>
        </Card>
      </div>
      <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="">
            <p className="text-gray-500 text-sm">Total Item Terjual</p>
            <p className="text-2xl font-bold">
              {totalQuantity.toLocaleString("id-ID")}
            </p>
          </div>
        </Card>
        <Card>
          <div className="">
            <p className="text-gray-500 text-sm">Total Omzet</p>
            <p className="text-2xl font-bold">
              Rp {totalOmzet.toLocaleString("id-ID")}
            </p>
          </div>
        </Card>
        <Card>
          <div className="">
            <p className="text-gray-500 text-sm">Total Profit Kotor</p>
            <p className="text-2xl font-bold">
              Rp {totalProfit.toLocaleString("id-ID")}
            </p>
          </div>
        </Card>
      </div>
      <AgGridProvider modules={modules}>
        <div style={{ height: "300px", minWidth: "900px" }}>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              sortable: true,
              filter: true,
            }}
            pagination
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            rowData={rowData}
            columnDefs={colDefs}
          />
        </div>
      </AgGridProvider>
    </div>
  );
}
