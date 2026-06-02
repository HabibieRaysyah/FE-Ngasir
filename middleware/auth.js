import { redirect } from "react-router-dom";

export function auth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  return null;
}
