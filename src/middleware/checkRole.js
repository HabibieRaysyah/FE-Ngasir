import { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function CheckRole() {
  const [store, setStore] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Token tidak valid:", error);
      navigate("/login");
      return;
    }

    const fetchUserStore = async () => {
      try {
        const res = await api.get(`/store`);

        setStore(res.data.data);
      } catch (err) {
        console.log("Server Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStore();
  }, [id, navigate]);

  if (loading) {
    return (<div>Memvalidasi Akses...</div>);
  }

  const currentStore = store.find(
    (stor) => stor.store_id == id && stor.user_id == user?.id,
  );

  if (!currentStore) {
    navigate(-1);
    return null;
  }

  return null;
}
