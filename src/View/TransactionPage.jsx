import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { Badge, Button, Select, Card, Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const modules = [AllCommunityModule];

export default function TransactionPage() {
  const [rowData, setRowData] = useState([]);
  const [transItem, setTransItem] = useState([]);
  const { id } = useParams();
  const [periode, setPeriode] = useState("");
  const [tanggalAcuan, setTanggalAcuan] = useState(null);
  const [dariTanggal, setDariTanggal] = useState(null);
  const [sampaiTanggal, setSampaiTanggal] = useState(null);
  const [selectedKasir, setSelectedKasir] = useState("");
  const [kasirList, setKasirList] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [totalItemTerjual, setTotalItemTerjual] = useState(0);
  const [estimasiProfitKotor, setEstimasiProfitKotor] = useState(0);

  const [colDefs1] = useState([
    { field: "date", headerName: "tanggal" },
    {
      field: "id",
      headerName: "Jumlah Transaksi",
      aggFunc: "count",
    },
    {
      field: "total_price",
      headerName: "Total Nominal",
      aggFunc: "sum",
      valueFormatter: (params) => `Rp ${params.value.toLocaleString("id-ID")}`,
    },
  ]);

  const [colDefs] = useState([
    { field: "code_transaction", headerName: "Kode Transaksi", width: 180 },
    { field: "user_id", headerName: "User ID", width: 100 },
    {
      field: "total_price",
      headerName: "Total Harga",
      cellRenderer: (params) =>
        `Rp ${Number(params.value).toLocaleString("id-ID")}`,
    },
    {
      field: "method",
      headerName: "Metode Bayar",
      cellRenderer: (params) => (
        <div className="flex p-2">
          {params.value === "cash" && <Badge color="success">Cash</Badge>}
          {params.value === "qris" && <Badge color="info">QRIS</Badge>}
          {params.value === "e-wallet" && (
            <Badge color="warning">E-Wallet</Badge>
          )}
        </div>
      ),
    },
  ]);

  const handleGetTransItem = async () => {
    try {
      const res = await api.get(`/transitems/${id}`);
      console.log(res.data.data);
      setTransItem(res.data.data);

      console.log(transItem);

      const totalItems = res.data.data.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );
      setTotalItemTerjual(totalItems);

      const totalOmzetTemp = rowData?.reduce(
        (pref, item) => Number(pref) + Number(item.total_price),
        0,
      );
      setEstimasiProfitKotor(totalOmzetTemp * 0.3);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const handleGet = async () => {
    try {
      const res = await api.get(`/transaction/${id}`);
      console.log("test");
      console.log(res.data.data);
      setRowData(res.data.data);
      setFilteredRowData(res.data.data);
    } catch (err) {
      console.log("Server Error", err.message);
    }
  };

  const handleGetKasir = async () => {
    try {
      const res = await api.get("/users/kasir");
      setKasirList(res.data.data);
    } catch (err) {
      console.log("Error fetching kasir:", err.message);
    }
  };

  const applyFilter = () => {
    let filtered = [...rowData];

    if (periode) {
      const now = new Date();
      const startDate = new Date();

      if (periode === "hari ini") {
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= startDate;
        });
      } else if (periode === "minggu ini") {
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= startDate;
        });
      } else if (periode === "bulan ini") {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= startDate;
        });
      } else if (periode === "tahun ini") {
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= startDate;
        });
      }
    }

    if (tanggalAcuan) {
      const acuanDate = new Date(tanggalAcuan);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate.toDateString() === acuanDate.toDateString();
      });
    }

    if (dariTanggal && sampaiTanggal) {
      const startDate = new Date(dariTanggal);
      const endDate = new Date(sampaiTanggal);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    } else if (dariTanggal) {
      const startDate = new Date(dariTanggal);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate >= startDate;
      });
    } else if (sampaiTanggal) {
      const endDate = new Date(sampaiTanggal);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate <= endDate;
      });
    }

    if (selectedKasir) {
      filtered = filtered.filter(
        (item) =>
          item.user_id === selectedKasir || item.kasir_id === selectedKasir,
      );
    }

    setFilteredRowData(filtered);

    const filteredTransItems = transItem.filter((item) => {
      const itemTransaction = filtered.find(
        (trans) => trans.id === item.transaction_id,
      );
      return itemTransaction;
    });

    const totalItems = filteredTransItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
    setTotalItemTerjual(totalItems);

    const totalOmzetFiltered = filtered.reduce(
      (pref, item) => Number(pref) + Number(item.total_price),
      0,
    );
    setEstimasiProfitKotor(totalOmzetFiltered * 0.3);
  };

  const resetFilter = () => {
    setPeriode("");
    setTanggalAcuan(null);
    setDariTanggal(null);
    setSampaiTanggal(null);
    setSelectedKasir("");
    setFilteredRowData(rowData);

    const totalItems = transItem.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
    setTotalItemTerjual(totalItems);

    const totalOmzet = rowData.reduce(
      (pref, item) => Number(pref) + Number(item.total_price),
      0,
    );
    setEstimasiProfitKotor(totalOmzet * 0.3);
  };

  const exportToExcel = () => {
    const exportData = filteredRowData.map((item) => ({
      "Kode Transaksi": item.code_transaction,
      "User ID": item.user_id,
      "Total Harga": `Rp ${Number(item.total_price).toLocaleString("id-ID")}`,
      "Metode Bayar": item.method,
      Tanggal: new Date(item.createdAt || item.date).toLocaleDateString(
        "id-ID",
      ),
      Waktu: new Date(item.createdAt || item.date).toLocaleTimeString("id-ID"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
    XLSX.writeFile(
      wb,
      `laporan_penjualan_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const totalOmzet = filteredRowData?.reduce(
    (pref, item) => Number(pref) + Number(item.total_price),
    0,
  );

  useEffect(() => {
    handleGet();
    handleGetTransItem();
    handleGetKasir();
  }, [id]);

  useEffect(() => {
    setEstimasiProfitKotor(totalOmzet * 0.3);
  }, [totalOmzet]);

  return (
    <div className="p-5">
      <div className="flex justify-start mb-5">
        <p className="text-2xl font-bold">Laporan Penjualan</p>
      </div>

      <div className="mb-5">
        <Card>
          <div className="flex grid-cols-6 gap-4">
            <div className="w-full">
              <label htmlFor="periode">Periode</label>
              <Select
                className="w-full"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="" selected hidden disabled>
                  == Pilih Periode ==
                </option>
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
            <div className="w-full">
              <label htmlFor="kasir">Kasir</label>
              <Select
                className="w-[100%]"
                value={selectedKasir}
                onChange={(e) => setSelectedKasir(e.target.value)}
              >
                <option value="" selected hidden disabled>
                  == Pilih Kasir ==
                </option>
                {kasirList.map((kasir) => (
                  <option key={kasir.id} value={kasir.id}>
                    {kasir.name || kasir.username}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button color="blue" onClick={applyFilter}>
              Terapkan Filter
            </Button>{" "}
            <Button color="blue" outline onClick={resetFilter}>
              Reset
            </Button>
            <Button color="blue" outline onClick={exportToExcel}>
              Export Excel
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex grid-cols-4 gap-5 mb-5">
        <Card className="w-[100%] " style={{ padding: "1px !important" }}>
          <div className="block gap-3">
            <p className="text-[#535353] font-bold text-sm mb-1">Total Omzet</p>
            <p className="font-bold text-2xl">
              Rp.{totalOmzet?.toLocaleString("id-ID") || 0}
            </p>
          </div>
        </Card>
        <Card className="w-[100%] " style={{ padding: "1px !important" }}>
          <div className="block gap-3">
            <p className="text-[#535353] font-bold text-sm mb-1">
              Total Transaksi
            </p>
            <p className="font-bold text-2xl">{filteredRowData.length}</p>
          </div>
        </Card>
        <Card className="w-[100%] " style={{ padding: "1px !important" }}>
          <div className="block gap-3">
            <p className="text-[#535353] font-bold text-sm mb-1">
              Total Item Terjual
            </p>
            <p className="font-bold text-2xl">{totalItemTerjual}</p>
          </div>
        </Card>
        <Card className="w-[100%] " style={{ padding: "1px !important" }}>
          <div className="block gap-3">
            <p className="text-[#535353] font-bold text-sm mb-1">
              Estimasi Profit Kotor
            </p>
            <p className="font-bold text-2xl">
              Rp.{estimasiProfitKotor?.toLocaleString("id-ID") || 0}
            </p>
          </div>
        </Card>
      </div>
      <div className="flex grid-cols-2 gap-5">
        <div>
          <AgGridProvider modules={modules}>
            <div style={{ height: "300px", minWidth: "400px" }}>
              <AgGridReact
                defaultColDef={{
                  flex: 1,
                  sortable: true,
                  filter: true,
                }}
                pagination
                rowData={filteredRowData}
                columnDefs={colDefs1}
              />
            </div>
          </AgGridProvider>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <AgGridProvider modules={modules}>
            <div
              className="ag-theme-alpine"
              style={{ height: "300px", width: "100%" }}
            >
              <AgGridReact
                defaultColDef={{
                  flex: 1,
                  sortable: true,
                  filter: true,
                }}
                pagination
                rowData={filteredRowData}
                columnDefs={colDefs}
              />
            </div>
          </AgGridProvider>
        </div>
      </div>
    </div>
  );
}
