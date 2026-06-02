import { createContext, useEffect, useState } from "react";
import { BiSolidHandLeft } from "react-icons/bi";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleGetData = async (id, filter) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.get(`/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filter) {
        const filtered = res.data.data.filter(
          (item) => item.category_id == filter,
        );
        setProducts([]);
        setProducts(filtered);
      } else {
        setProducts(res.data.data);
      }

      console.log(products);
    } catch (err) {
      console.log("Server Error" + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, handleGetData, isLoading, setLoading }}
    >
      {children}
    </ProductContext.Provider>
  );
}
