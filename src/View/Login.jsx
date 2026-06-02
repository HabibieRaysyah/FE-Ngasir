import { HiOutlineArchiveBox } from "react-icons/hi2";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { BsStars } from "react-icons/bs";
import { config, useSpring, animated } from "react-spring";
import { Link,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import "../style/StyleLogReg.css";
// import { MdOutlineShowChart } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE :", res.data);

      localStorage.setItem("token", res.data.data.token);

      navigate("/homepage");
    } catch (err) {
      console.log(err.response?.data);
      alert("Login gagal");
    }
  };

  const slideIn = useSpring({
    from: { transform: "translateX(-100%)", opacity: 0 },
    to: { transform: "translateX(0%)", opacity: 1 },
    config: config.gentle,
  });

  const slideIn2 = useSpring({
    from: { transform: "translateX(-100%)", opacity: 0 },
    to: { transform: "translateX(0%)", opacity: 1 },
    config: config.gentle,
    delay: 200,
  });

  const slideIn3 = useSpring({
    from: { transform: "translateY(-100%)", opacity: 0 },
    to: { transform: "translateY(0%)", opacity: 1 },
    config: config.gentle,
    delay: 400,
  });

  const slideIn4 = useSpring({
    from: { transform: "translateY(-100%)", opacity: 0 },
    to: { transform: "translateY(0%)", opacity: 1 },
    config: config.gentle,
    delay: 600,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/homepage");
    }
  }, [navigate]);

  return (
    <div className="flex login-content">
      <div className="left-content">
        <div className="flex header">
          <animated.div style={{ ...slideIn }}>
            <div className="flex">
              <HiOutlineArchiveBox color="white" size={30} />
              <h1
                className="text-white font-bold text-2xl "
                style={{ marginLeft: "10px" }}
              >
                NGASIR
              </h1>
            </div>
          </animated.div>
          <div className="circular">
            <div className="circular1"></div>
            <div className="circular2"></div>
            <div className="circular3"></div>
          </div>
        </div>
        <div className="center-content  ">
          <div className="content">
            <animated.div style={{ ...slideIn }}>
              <h1 className="text-4xl font-bold" style={{ color: "white" }}>
                Satu Platfrom Untuk Kebutuhan Managment Toko anda
              </h1>
            </animated.div>
            <animated.div style={{ ...slideIn2 }}>
              <p
                style={{
                  color: "#cccccc",
                  fontSize: "16px",
                  paddingTop: "10px",
                }}
              >
                Optimalkan stok, kelola karyawan, dan pantau performa bisnis
                dari mana saja secara real-time.
              </p>
            </animated.div>
          </div>
        </div>

        <div className="bottom-content">
          <div className="flex content-bottomm">
            <animated.div style={{ ...slideIn3 }}>
              <div className="block">
                <p
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  10k+
                </p>
                <p style={{ color: "#d9d9d9", fontSize: "12px" }}>
                  Bisnis Aktif
                </p>
              </div>
            </animated.div>
            <div
              style={{
                borderLeft: "2px solid white",
                height: "45px",
                margin: "0 20px",
              }}
            ></div>
            <animated.div style={{ ...slideIn4 }}>
              <div className="block">
                <p
                  style={{
                    color: "white ",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  99.9%
                </p>
                <p style={{ color: "#d9d9d9", fontSize: "12px" }}>
                  Uptime Sistem
                </p>
              </div>
            </animated.div>
          </div>
          <div className="iconRight">
            <div className="starIcon">
              <BsStars color="#ffffff5b" size={120} />
            </div>
            <div className="chartIcon">
              {/* <MdOutlineShowChart  size={250} color="#ff00005b"/> */}
            </div>
          </div>
        </div>
      </div>
      <div
        className="right-content"
        style={{ padding: "70px 100px", zIndex: "3" }}
      >
        <h1
          style={{ fontSize: "20px", fontWeight: "bold", paddingBottom: "5px" }}
        >
          Masukan Ke akun anda
        </h1>
        <p style={{ paddingBottom: "20px" }}>
          Kelola bisnis Anda dengan presisi dan kemudahan.
        </p>
        <Card style={{ width: "400px", marginBottom: "25px" }}>
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1">Email anda</Label>
              </div>
              <TextInput
                style={{ padding: "10px" }}
                id="email1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="habibieresya@gmail.com"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1">Password anda</Label>
              </div>

              <TextInput
                style={{ padding: "10px" }}
                id="password1"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="remember">Forgot Password?</Label>
            </div>
            <Button type="button" onClick={handleLogin}>
              Submit
            </Button>
          </form>
        </Card>

        <p style={{ fontSize: "14px" }}>
          Belum memiliki akun? silahkan{" "}
          <Link to="/signup">
            <span style={{ color: "#3146fe", cursor: "pointer" }}>Daftar</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
