import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Registration from "../View/Registration";
import HomePage from "../View/HomePage";
import HomePageTemp from "../Template/HomePageTemp";
import { auth } from "../../middleware/auth";
import DashboardPageTemp from "../Template/DashboardPageTemp";
import DashboardPage from "../View/DashboardPage";
import PostPage from "../View/PostPage";
import CategoryPage from "../View/CategoryPage";
import ProductPage from "../View/ProductPage";
import BarcodeShowPage from "../View/BarcodeShowPage";
import SuplierPage from "../View/SuplierPage";
import TransactionPage from "../View/TransactionPage";
import TransactionItemPage from "../View/TransactionItemPage";
import StockPage from "../View/StockPage";
import InventoryPage from "../View/InventoryPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Registration />,
  },
  {
    path: "/homepage",
    element: <HomePageTemp />,
    loader: auth,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: "/dashboard/:id",
    element: <DashboardPageTemp />,
    loader: auth,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "postcashier", element: <PostPage /> },
      { path: "category", element: <CategoryPage /> },
      { path: "product", element: <ProductPage /> },
      { path: "suplier", element: <SuplierPage /> },
      { path: "transaction", element: <TransactionPage />},
      { path: "transactionitems", element: <TransactionItemPage />},
      { path: "stock", element: <StockPage />},
      { path: "inventory", element: <InventoryPage/>},
    ],
  },
  {
    path: "/dashboard/:id/product/:barcode/barcode",
    element: <BarcodeShowPage />,
    loader: auth,
  },
]);
