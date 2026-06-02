import {
  Button,
  ButtonGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Select, // Tambahkan Select
} from "flowbite-react";
import CardProductComp from "../Component/CardProductComp";
import { use, useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { HiOutlineExclamationCircle, HiUserCircle } from "react-icons/hi";
import { TbCash } from "react-icons/tb";
import { BsCashStack } from "react-icons/bs";
import { PiReceiptBold } from "react-icons/pi";
import { FaWallet, FaQrcode } from "react-icons/fa"; // Tambahkan icon untuk e-wallet dan qris
import { jwtDecode } from "jwt-decode";
import { config, useTransition, animated } from "react-spring";
import AlertSuccess from "../Component/AlertSuccess";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import QrScannerComp from "../Component/QrScannerComp";
import Barcode from "react-barcode";
import { usePDF } from "react-to-pdf";
import StrukComponent from "../Component/StrukComponent";

export default function PostPage() {
  const items = [
    "Semua nya",
    "Rumah Tangga",
    "Alat Tulis",
    "Tempat Makan",
    "Buku Buku",
  ];
  const { products, handleGetData } = useContext(ProductContext);
  const { id } = useParams(); // Ambil ID dari URL di sini
  const [isTrans, setIsTrans] = useState(false);
  const [transactionItems, setTransactionItems] = useState([]);
  const [isSuccess, setIsSucess] = useState();
  const [change, setChange] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [categorie, setCategorie] = useState([]);
  const { toPDF, targetRef } = usePDF({ filename: "struk-transaksi.pdf" });

  const [paid, setPaid] = useState();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Tambahkan state untuk method pembayaran

  const limitKata = (teks, batas) => {
    const kata = teks.split(" ");
    if (kata.length > batas) {
      return kata.slice(0, batas).join(" ") + "...";
    }
    return teks;
  };

  const getCategorie = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`categorie/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategorie(res.data.data);
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  console.log(categorie);

  const handleBarcode = (barcode) => {
    console.log(barcode);

    const product = products.find((item) => item.barcode == barcode);

    if (product) {
      setTransactionItems([
        ...transactionItems,
        {
          id: product.id,
          name: product.name,
          image: product.img,
          selling_price: product.selling_price,
          quantity: 1,
        },
      ]);

      setIsTrans(true);
    }

    console.log(transactionItems);
  };

  const customInputTheme = {
    field: {
      input: {
        colors: {
          gray: "bg-blue-50 text-[#004BCA] font-bold  disabled:bg-blue-50 disabled:text-blue-600 disabled:opacity-100",
        },
      },
    },
  };

  const handleDeleteAllTrans = () => {
    setTransactionItems([]);
    setIsTrans(false);
  };

  const handlePrev = (id, selling_price, stock) => {
    const isId = products.find((item) => item.id === id);
    if (isId) {
      setTransactionItems(
        transactionItems.map((item) => {
          if (item.id == id) {
            const newQuantity =
              item.quantity == 1 ? item.quantity : item.quantity - 1;
            return {
              ...item,
              quantity: newQuantity,
              selling_price: isId.selling_price * newQuantity,
            };
          }
          return item;
        }),
      );
    }
  };

  const handleNext = (id) => {
    const isId = products.find((item) => item.id === id);
    if (isId) {
      setTransactionItems(
        transactionItems.map((item) => {
          if (item.id == id) {
            const newQuantity =
              item.quantity >= isId.stock ? item.quantity : item.quantity + 1;
            return {
              ...item,
              quantity: newQuantity,
              selling_price: isId.selling_price * newQuantity,
            };
          }
          return item;
        }),
      );
    }
  };

  const handleClickPush = (id, name, img, selling_price, stock) => {
    const isEnough = transactionItems.some((item) => item.id === id);
    setIsTrans(true);
    if (isEnough) {
      setTransactionItems(
        transactionItems.map((item) => {
          if (item.id == id) {
            const newQuantity =
              item.quantity < stock ? item.quantity + 1 : item.quantity;

            return {
              ...item,
              quantity: newQuantity,
              selling_price: selling_price * newQuantity,
            };
          }
          return item;
        }),
      );
    } else {
      setTransactionItems([
        ...transactionItems,
        {
          id: id,
          name: name,
          image: img,
          selling_price: selling_price,
          quantity: 1,
        },
      ]);
    }
  };

  const formatRupiah = (angka) => {
    const formatRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

    return formatRupiah;
  };

  const subTotall = transactionItems?.reduce(
    (prev, item) => prev + Number(item.selling_price),
    0,
  );

  const tax = (5 / 100) * subTotall;
  const total = tax + Number(subTotall);
  const changee = paid - total;
  const dataForFetch = {
    store_id: Number(id),
    user_id: user?.id,
    total_price: total,
    paid_amount: Number(paid),
    method: paymentMethod,
    products: transactionItems,
  };

  const handlePost = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.post("/transaction", dataForFetch, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsTrans(false);
      setTransactionItems([]);
      setChange();
      setPaid(""); // Reset paid
      setPaymentMethod("cash"); // Reset payment method
      setIsSucess(true);
      console.log("succes" + res);

      setTimeout(() => {
        setIsSucess(false);
      }, 3000);

      handleGetData(id);
    } catch (err) {
      console.log("Server Error" + err.message);
    }
  };

  const handleQr = () => {};

  // Function untuk mendapatkan icon berdasarkan method pembayaran
  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "cash":
        return <BsCashStack className="mr-2" />;
      case "ewallet":
        return <FaWallet className="mr-2" />;
      case "qris":
        return <FaQrcode className="mr-2" />;
      default:
        return <BsCashStack className="mr-2" />;
    }
  };

  // Function untuk mendapatkan label button berdasarkan method pembayaran
  const getPaymentButtonText = () => {
    switch (paymentMethod) {
      case "cash":
        return "Bayar dengan Cash";
      case "ewallet":
        return "Bayar dengan E-Wallet";
      case "qris":
        return "Bayar dengan QRIS";
      default:
        return "Bayar Sekarang";
    }
  };

  useEffect(() => {
    handleGetData(id);
    getCategorie();
  }, [id]);

  useEffect(() => {
    setChange(changee);
  }, [paid]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      setUser(decoded);
    }
  }, []);

  const slideIn = useTransition(isSuccess, {
    from: { transform: "translateX(200%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(200%)", opacity: 0 },
    config: config.gentle,
  });

  const transactionslide = useTransition(isTrans, {
    from: { transform: "translateX(200%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(200%)", opacity: 0 },
  });

  return (
    <div className="flex">
      <div className="" style={{ padding: "20px 20px 0px 20px" }}>
        <div>
          <div className="w-full overflow-x-auto overflow-hidden content-scroll whitespace-nowrap py-4 scroll-smooth">
            <div className="flex scroll gap-5 w-160  ">
              <Button onClick={() => setOpenModal(true)}>
                <MdOutlineQrCodeScanner />
              </Button>

              <Button onClick={() => handleGetData(id)}>Semuanya</Button>
              {categorie?.map((item, index) => (
                <div
                  key={index}
                  className="flex-nonflex items-center justify-center text-white text-2xl font-bold"
                >
                  <Button
                    color="alternative"
                    onClick={() => handleGetData(id, item.id)}
                  >
                    {item.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-5 overflow-auto h-100">
            {products?.map((product, index) => (
              <div
                key={index}
                onClick={() =>
                  handleClickPush(
                    product.id,
                    product.name,
                    product.img,
                    product.selling_price,
                    product.stock,
                  )
                }
              >
                <CardProductComp
                  img={product.img}
                  name={product.name}
                  price={product.selling_price}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {transactionslide(
        (style, item) =>
          item && (
            <animated.div style={style}>
              <div
                className="max-w-90 w-110  bg-white relative   container-trans verflow-y-auto overflow-x-hidden"
                style={{
                  minHeight: "90vh",
                  height: "50vh",
                  borderLeft: "1px solid #dedede",
                }}
              >
                <div
                  className="w-90 h-15 bg-[#F8FAFC] p-5"
                  style={{ borderBottom: "1px solid #dedede" }}
                >
                  <div className="flex justify-between">
                    <p style={{ fontSize: "12px" }}>Barang Yang di Beli</p>
                    <div
                      onClick={() => handleDeleteAllTrans()}
                      className="cursor-pointer"
                    >
                      <p className="" style={{ fontSize: "12px" }}>
                        Hapus semua
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 h-80 overflow-auto overflow-hidden">
                  {transactionItems?.map((item, index) => (
                    <div className="flex gap-3 mt-2" key={index}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-15 rounded-sm h-10"
                      />
                      <p>{limitKata(item.name, 1)}</p>
                      <div className="flex relative ">
                        <ButtonGroup className="shadow-none  ">
                          <Button
                            color="alternative"
                            className="rounded-none p-2 h-7"
                            onClick={() =>
                              handlePrev(
                                item.id,
                                item.selling_price,
                                item.stock,
                                item.image,
                              )
                            }
                          >
                            -
                          </Button>
                          <Button color="alternative" className="p-3 h-7">
                            {item.quantity}
                          </Button>
                          <Button
                            color="alternative"
                            className="p-2 h-7"
                            onClick={() =>
                              handleNext(
                                item.id,
                                item.selling_price,
                                item.stock,
                                item.img,
                                item.name,
                              )
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </div>
                      <p>{formatRupiah(item.selling_price)}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="w-90  bg-[#F8FAFC] h-[60%] px-3 py-4"
                  style={{ borderTop: "1px solid #dedede" }}
                >
                  <div
                    className="flex justify-between text-gray-500"
                    style={{ fontSize: "12px" }}
                  >
                    <p>SubTotal</p>
                    <p>{formatRupiah(subTotall)}</p>
                  </div>
                  <div
                    className="flex justify-between text-gray-500 mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    <p>Tax (5%)</p>
                    <p>{formatRupiah(tax)}</p>
                  </div>
                  <hr className="my-3 text-gray-300" />
                  <div className="flex mb-5 justify-between ">
                    <p className="font-semibold">Total</p>
                    <p className="text-xl font-bold text-[#004BCA]">
                      {formatRupiah(total)}
                    </p>
                  </div>

                  <div className="bg-white shadow-inner p-5 w-[100%] mb-3">
                    <p className="text-sm text-gray-500 mb-2">
                      Metode Pembayaran
                    </p>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      icon={getPaymentIcon}
                    >
                      <option value="cash">💰 Cash / Tunai</option>
                      <option value="ewallet">
                        📱 E-Wallet (OVO, GoPay, Dana, dll)
                      </option>
                      <option value="qris">📲 QRIS</option>
                    </Select>
                  </div>

                  <div className="bg-white shadow-inner p-5 w-[100%]">
                    <p className="text-sm text-gray-500 mb-2 ">
                      Penanganan Uang
                    </p>
                    <div className="grid-cols-2 flex gap-3">
                      <div className="block ">
                        <Label>Di Bayar</Label>
                        <TextInput
                          type="number"
                          placeholder="Masukan Uang"
                          icon={() => <p>Rp.</p>}
                          onChange={(e) => setPaid(e.target.value)}
                        />
                      </div>
                      <div className="block ">
                        <Label>Kembalian</Label>
                        <TextInput
                          type="text"
                          readOnly
                          className="pointer-events-none"
                          theme={customInputTheme}
                          value={
                            paid
                              ? paid >= total
                                ? change
                                  ? change == 0
                                    ? 0
                                    : change
                                  : change == 0
                                    ? 0
                                    : "Kembalian"
                                : "Uang Kurang"
                              : "Kembalian"
                          }
                          icon={() => <p>Rp.</p>}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid-cols-2 flex gap-5 mt-3">
                    <div>
                      <Button
                        color="alternative"
                        className="flex w-37  gap-2"
                        onClick={() => toPDF()}
                      >
                        <PiReceiptBold />
                        <p>Cetak Struk</p>
                      </Button>
                    </div>
                    <div>
                      <Button className="flex gap-2" onClick={handlePost}>
                        {getPaymentIcon()}
                        <p>{getPaymentButtonText()}</p>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </animated.div>
          ),
      )}

      {slideIn(
        (style, item) =>
          item && (
            <div className="Alert">
              <animated.div style={style}>
                <AlertSuccess message="Berhasil Menambahkan ke Transaksi" />
              </animated.div>
            </div>
          ),
      )}

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <QrScannerComp barcode={handleBarcode} />
            <div className="flex m-2 justify-center gap-4">
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              {/*          
              <Barcode
                value="5133218016389"
                format="CODE128"
                width={1.8}
                height={80}
                renderer="img"
                fontOptions="bold"
              /> */}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <div style={{ position: "absolute", left: "-9999px" }}>
        <StrukComponent ref={targetRef} transactionItems={transactionItems} />
      </div>
    </div>
  );
}
