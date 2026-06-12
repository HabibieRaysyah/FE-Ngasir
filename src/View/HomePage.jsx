import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  ModalFooter,
  TextInput,
  Label,
  FileInput,
  HelperText,
  Card,
  Badge,
  Spinner,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { UserContext } from "../Context/UserContext";
import AlertSuccess from "../Component/AlertSuccess";
import { config,  animated, useTransition } from "react-spring";
import PaginationComp from "../Component/PaginationComp";
import { Link, redirect, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [toko, setToko] = useState([]);
  const [isSuccess, setIsSucess] = useState();
  const [name, setName] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState(null);
  const { user } = useContext(UserContext);
  // const nav = useNavigate;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleCreateStore = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("image", file);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("user_id", user.id);

    try {
      const res = await api.post("/store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response" + res);
      setOpenModal(false);
      setIsSucess(true);

      setTimeout(() => {
        setIsSucess(false); 
      }, 3000);
handlleGetData( )
    } catch (err) {
      console.log(err.message);
    }
  };

  const handlleGetData = async (page) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const res = await api.get(`/store/?page=${page}&limit=6`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToko(res.data.data);

      console.log(res.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const SuccessData = (data) => {
    setIsSucess(data);
  };

  const slideIn = useTransition(isSuccess, {
    from: { transform: "translateX(200%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(200%)", opacity: 0 },
    config: config.gentle,
  });


  // const handleClickNav = (id) => {
  //   nav(`/dashboard/${id}`);
  // };

  useEffect(() => {
    handlleGetData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(toko.totalPages);
  }, [toko]);

  if (loading) {
    return <Spinner aria-label="Default status example" />;
  } else {
    return (
      <div style={{ padding: "35px" }}>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-mono">Daftar Toko</h1>
          </div>

          <div className="flex">
            <div
              className="flex"
              style={{ alignItems: "center", paddingRight: "20px" }}
            >
              <p className="text-sm text-gray-400">urutkan:</p>

              <Select
                id="countries"
                style={{ height: "40px", width: "170px", padding: "5px" }}
                required
              >
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </Select>
            </div>

            <div>
              <Button
                color="blue"
                style={{ padding: "20px" }}
                onClick={() => setOpenModal(true)}
              >
                + Tambah Toko Baru
              </Button>
            </div>
          </div>
        </div>

        {toko? ( <div className="pt-10 h-100 flex flex-wrap max-w-5xl gap-2">
          {toko.data?.map((tokoks) => (
        <Link to={`/dashboard/${tokoks.Store.id}`}>
              <Card
              className="w-60 h-auto hoverCard"
              imgAlt={tokoks.Store.image}
              imgSrc={tokoks.Store.image}
              theme={{
                img: {
                  base: "w-full h-30 object-cover", // Mengatur tinggi gambar menjadi h-40 (10rem) dan mencegah distorsi
                },
              }}
              key={tokoks.id}
            >
              <div className="flex justify-between">
                <h5 className="text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {tokoks.Store.name}
                </h5>
                <Badge size="sm" color="gray">
                  {tokoks.Store.type}
                </Badge>
              </div>
            </Card>
        </Link>
          ))}
        </div>) : (
          <div className="pt-10 flex flex-wrap max-w-5xl gap-2 justify-center">
            <h1 className="text-3 xl h-100 text-center text-gray-300" style={{alignContent: "center"}}>Belum ada Toko</h1>
          </div>
        )}

       

        <PaginationComp
          onPageChange={onPageChange}
          currentPage={currentPage}
          maxPage={!totalPages ? 1 : totalPages}
        />

        <Modal
          dismissible
          show={openModal}
          size="lg"
          onClose={() => setOpenModal(false)}
        >
          <ModalHeader>
            <div className="block">
              <h3>Buat Toko Baru</h3>
              <p className="text-sm text-gray-500">
                Lengkapi Informasi untuk membuat cabang baru
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Nama Toko</Label>
                </div>
                <TextInput
                  id="namatoko"
                  type="text"
                  placeholder="Masukan nama toko..."
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="namatoko">Pilih kategori Toko</Label>
                </div>

                <Select
                  id="countries"
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option hidden>Pilih Katerogori</option>
                  <option value="coffee_shop">Coffe Shop</option>
                  <option value="retail">Retail</option>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                  Upload file
                </Label>
                <FileInput
                  id="file-upload-helper-text"
                  onChange={handleChangeFile}
                />
                <HelperText className="mt-1">
                  SVG, PNG, JPG or GIF (MAX. 800x400px).
                </HelperText>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button color="alternative" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
            <Button onClick={handleCreateStore}>Buat Toko</Button>
          </ModalFooter>
        </Modal>

        {slideIn(
          (style, item) =>
            item && (
              <div className="Alert">
                <animated.div style={style}>
                  <AlertSuccess
                    isSuccess={SuccessData}
                    message="Berhasil Menambahkann Toko"
                  />
                </animated.div>
              </div>
            ),
        )}
      </div>
    );
  }
}
