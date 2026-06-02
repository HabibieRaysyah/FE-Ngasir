import { useContext, useEffect } from "react";
import Barcode from "react-barcode";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import { Button } from "flowbite-react";

export default function BarcodeShowPage() {
  const { products, handleGetData } = useContext(ProductContext);
  const { id, barcode } = useParams();
  const navigate = useNavigate();

  const formatRupiah = (angka) => {
    const formatRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

    return formatRupiah;
  };

  const filtered = products?.find((item) => item.barcode == barcode);

  useEffect(() => {
    handleGetData(id);
  }, [id]);
  return (
    <div className="flex justify-center min-h-screen items-center py-10 px-[90px]">
      <div>
        <div className="grid grid-cols-3 gap-8 justify-items-center w-full max-w-6xl mb-3">
          {Array(15)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2 bg-white rounded-sm border border-dashed border-gray-300  w-full"
              >
                <span className="font-semibold text-gray-800 mb-1 text-sm block max-w-[200px] truncate">
                  {filtered?.name}
                </span>

                <div className="my-2">
                  <Barcode
                    value={barcode}
                    format="CODE128"
                    width={1.9}
                    height={70}
                    renderer="img"
                    background="#ffffff"
                    lineColor="#000000"
                    margin={10}
                    fontSize={25}
                  />
                </div>

                <span className="">{formatRupiah(filtered?.price)}</span>
              </div>
            ))}
        </div>
        <div className="flex justify-center gap-2 print:hidden">
          <Button onClick={() => window.print()}>Cetak</Button>
          <Button onClick={() => navigate(`/dashboard/${id}/product`)}>Kembali</Button>
        </div>
      </div>
    </div>
  );
}
