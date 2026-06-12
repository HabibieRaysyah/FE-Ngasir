import { GrMoney } from "react-icons/gr";
import CardDashComp from "../Component/CardDashComp";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineReceipt, MdOutlineShoppingBag } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "flowbite-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function DashboardPage() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [rowData, setRowData] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    todayIncome: 0,
    todayIncomePercentage: 0,
    todayIncomeTrend: "up",
    todayTransaction: 0,
    todayTransactionPercentage: 0,
    todayTransactionTrend: "up",
    todayProfit: 0,
    todayProfitPercentage: 0,
    todayProfitTrend: "up",
    dailyTarget: 1000000,
    yesterdayIncome: 0,
    yesterdayTransaction: 0,
    yesterdayProfit: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Trend Pendapatan per Hari",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Pendapatan: ${formatRupiah(context.raw)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatRupiah(value),
          stepSize: 100000,
        },
        title: {
          display: true,
          text: "Pendapatan (Rp)",
          font: { weight: "bold" },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        title: {
          display: true,
          text: "Tanggal",
          font: { weight: "bold" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const calculatePercentage = (today, yesterday) => {
    if (yesterday === 0) return today > 0 ? 100 : 0;
    const percentage = ((today - yesterday) / yesterday) * 100;
    return Math.abs(Math.round(percentage * 10) / 10);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const fetchDashboardData = async () => {
    try {
      const transactionsRes = await api.get(`/transaction/${id}`);
      const allTransactionsData = transactionsRes.data.data || [];
      setAllTransactions(allTransactionsData);

      const productsRes = await api.get(`/product/${id}`);
      const allProductsData = productsRes.data.data || [];
      setAllProducts(allProductsData);

      const todayTransactions = [];
      const yesterdayTransactions = [];

      for (const transaction of allTransactionsData) {
        const transactionDate = new Date(transaction.date);

        if (isToday(transactionDate)) {
          todayTransactions.push(transaction);
        } else if (isYesterday(transactionDate)) {
          yesterdayTransactions.push(transaction);
        }
      }

      let todayIncome = 0;
      let todayProfit = 0;

      for (const transaction of todayTransactions) {
        todayIncome += Number(transaction.total_price || 0);

        const today = new Date().toLocaleDateString("sv-SE");

        const itemsRes = await api.get(`/transitems/${id}`);
        const allitems = itemsRes.data.data;
        const items = allitems.filter((item) => item.date?.startsWith(today));
        for (const item of items) {
          const product = allProductsData.find((p) => p.id === item.product_id);
          if (product) {
            const profitPerItem =
              Number(product.selling_price) - Number(product.purchase_price);
            todayProfit += profitPerItem * Number(item.quantity);
          }
        }
      }

      // Calculate yesterday's income and profit
      let yesterdayIncome = 0;
      let yesterdayProfit = 0;

      for (const transaction of yesterdayTransactions) {
        yesterdayIncome += Number(transaction.total_price || 0);

        const itemsRes = await api.get(`/transitems/${transaction.id}`);
        const items = itemsRes.data.data || [];

        for (const item of items) {
          const product = allProductsData.find((p) => p.id === item.product_id);
          if (product) {
            const profitPerItem =
              Number(product.selling_price) - Number(product.purchase_price);
            yesterdayProfit += profitPerItem * Number(item.quantity);
          }
        }
      }

      const incomePercentage = calculatePercentage(
        todayIncome,
        yesterdayIncome,
      );
      const profitPercentage = calculatePercentage(
        todayProfit,
        yesterdayProfit,
      );
      const transactionPercentage = calculatePercentage(
        todayTransactions.length,
        yesterdayTransactions.length,
      );

      setDashboardData({
        todayIncome: todayIncome,
        todayIncomePercentage: incomePercentage,
        todayIncomeTrend: todayIncome >= yesterdayIncome ? "up" : "down",
        todayTransaction: todayTransactions.length,
        todayTransactionPercentage: transactionPercentage,
        todayTransactionTrend:
          todayTransactions.length >= yesterdayTransactions.length
            ? "up"
            : "down",
        todayProfit: todayProfit,
        todayProfitPercentage: profitPercentage,
        todayProfitTrend: todayProfit >= yesterdayProfit ? "up" : "down",
        dailyTarget: 1000000,
        yesterdayIncome: yesterdayIncome,
        yesterdayTransaction: yesterdayTransactions.length,
        yesterdayProfit: yesterdayProfit,
      });
    } catch (err) {
      console.log("Error fetching dashboard data:", err.message);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      setLoadingStock(true);
      const res = await api.get(`/product/${id}`);
      const products = res.data.data || [];

      // Filter products where stock <= min_stock
      const lowStock = products.filter((product) => {
        const currentStock = Number(product.stock);
        const minStock = Number(product.min_stock);
        return currentStock <= minStock;
      });

      setLowStockProducts(lowStock);
    } catch (err) {
      console.log("Error fetching low stock products:", err.message);
    } finally {
      setLoadingStock(false);
    }
  };

  const handleGet = async () => {
    try {
      setLoading(true);

      // Fetch all transaction items
      const res = await api.get(`/transitems/${id}`);
      setRowData(res.data.data);

      // Fetch all transactions to get dates
      const transactionsRes = await api.get(`/transaction/${id}`);
      const transactions = transactionsRes.data.data || [];

      // Create a map of transaction_id to date
      const transactionDateMap = new Map();
      transactions.forEach((trans) => {
        transactionDateMap.set(trans.id, trans.date);
      });

      // Group data per tanggal untuk chart
      const grouped = {};

      for (const item of res.data.data) {
        const transactionDate = transactionDateMap.get(item.transaction_id);

        if (transactionDate) {
          const date = new Date(transactionDate);
          const key = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });

          if (!grouped[key]) grouped[key] = 0;
          const itemTotal =
            Number(item.subtotal) || Number(item.price) * Number(item.quantity);
          grouped[key] += itemTotal;
        }
      }

      // Sort keys by date
      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      const sortedValues = sortedKeys.map((key) => grouped[key]);

      setChartData({
        labels: sortedKeys,
        datasets: [
          {
            label: "Pendapatan",
            data: sortedValues,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            borderRadius: 8,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
        ],
      });

      await Promise.all([fetchDashboardData(), fetchLowStockProducts()]);
    } catch (err) {
      console.log("Server Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleGet();
    }
  }, [id]);

  const targetPercentage = (
    (dashboardData.todayIncome / dashboardData.dailyTarget) *
    100
  ).toFixed(1);

  const getTrendIcon = (trend) => {
    return trend === "up" ? FaArrowTrendUp : FaArrowTrendDown;
  };

  const getBadgeColor = (trend) => {
    return trend === "up" ? "bg-[#f0fdf4]" : "bg-[#fef2f2]";
  };

  const getBadgeTextColor = (trend) => {
    return trend === "up" ? "text-[#16a34a]" : "text-[#dc2626]";
  };

  return (
    <div className="dashboard p-5 h-145 overflow-auto">
      <div className="headers">
        <h1 className="text-2xl font-bold">Tampilan Dashboard</h1>
        <h2 className="text-lg font">
          performa real-time untuk ruang ritel Anda.
        </h2>
      </div>

      <div className="pt-5 flex gap-7 grid grid-cols-3">
        <div>
          <CardDashComp
            title="Pendapatan Hari ini"
            Icon={GrMoney}
            Iconcolor={"#1156ea"}
            Iconbg={"bg-blue-200"}
            Iconbadg={getTrendIcon(dashboardData.todayIncomeTrend)}
            badgcolor={getBadgeColor(dashboardData.todayIncomeTrend)}
            badgetextcolor={getBadgeTextColor(dashboardData.todayIncomeTrend)}
            wBadge={"w-20"}
            badgvalue={`${dashboardData.todayIncomePercentage}%`}
            cardValue={formatRupiah(dashboardData.todayIncome)}
            persen={`w-[${Math.round(targetPercentage).toLocaleString}%]`}
            isSalary={"income"}
            subtitle={`${targetPercentage}% dari target harian`}
          />
        </div>
        <div>
          <CardDashComp
            title="Jumlah Transaksi Hari ini"
            Icon={MdOutlineReceipt}
            Iconcolor={"#000000"}
            Iconbg={"bg-gray-200"}
            badgcolor={getBadgeColor(dashboardData.todayTransactionTrend)}
            badgetextcolor={getBadgeTextColor(
              dashboardData.todayTransactionTrend,
            )}
            badgvalue={
              dashboardData.todayTransactionTrend === "up"
                ? `+${dashboardData.todayTransactionPercentage}%`
                : `-${dashboardData.todayTransactionPercentage}%`
            }
            wBadge={"w-21"}
            cardValue={dashboardData.todayTransaction.toString()}
            isSalary={"receipt"}
            subtitle={`vs yesterday: ${dashboardData.yesterdayTransaction} transaksi`}
          />
        </div>
        <div>
          <CardDashComp
            title="Profit Kotor Hari ini"
            Icon={MdOutlineShoppingBag}
            Iconcolor={"#17ee4d"}
            Iconbg={"bg-green-200"}
            Iconbadg={getTrendIcon(dashboardData.todayProfitTrend)}
            badgcolor={getBadgeColor(dashboardData.todayProfitTrend)}
            badgetextcolor={getBadgeTextColor(dashboardData.todayProfitTrend)}
            badgvalue={`${dashboardData.todayProfitPercentage}%`}
            isSalary={"shopping"}
            cardValue={formatRupiah(dashboardData.todayProfit)}
            subtitle={`${((dashboardData.todayProfit / dashboardData.todayIncome) * 100).toFixed(1)}% dari pendapatan` }
          />
        </div>
      </div>

      <div className="mt-8 flex grid-cols-2 gap-7">
        <div className="bg-white w-[100%] rounded-xl shadow-sm p-6">
          <div style={{ height: "400px" }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500">Loading chart...</p>
                </div>
              </div>
            ) : chartData.labels?.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Tidak ada data untuk ditampilkan
                </p>
              </div>
            )}
          </div>
        </div>

        <Card className="w-[50%] h-80 overflow-auto">
          <div className="text-left">
            <p className="font-bold text-1xl">Stock Yang Menipis</p>
          </div>
          <hr className="text-gray-400" />

          {loadingStock ? (
            <div className="text-center m-auto">
              <p className="text-gray-400">Loading stock data...</p>
            </div>
          ) : lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Min Stock: {product.min_stock} | Barcode:{" "}
                      {product.barcode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${product.stock <= product.min_stock / 2 ? "text-red-600" : "text-orange-500"}`}
                    >
                      Stock: {product.stock}
                    </p>
                    {product.stock <= product.min_stock / 2 && (
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                        Segera Restock!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center m-auto">
              <p className="text-gray-400">✓ Stock Aman</p>
              <p className="text-sm text-gray-300 mt-2">
                Semua produk memiliki stok di atas minimum yang ditentukan
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
