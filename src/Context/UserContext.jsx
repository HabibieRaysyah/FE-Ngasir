// context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [isLogin, setIslogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIslogin(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLogin, setIslogin }}>
      {children}
    </UserContext.Provider>
  );
}