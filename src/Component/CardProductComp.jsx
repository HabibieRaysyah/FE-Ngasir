import { Card } from "flowbite-react";

export default function CardProductComp({ img, name, price, stock }) {
  const formatRupiah = (angka) => {
    const formatRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

    return formatRupiah;
  };

  const formatted = formatRupiah(price)
  return (
    <Card className="p-1 w-48 h-auto cardProduct" style={{ cursor: "pointer" }}>
      <div className="block">
        <img src={img} alt="" className="rounded w-100 h-25 pb-2" />
        <h1 className="font-semibold text-sm">{name}</h1>
        <p className="text-lg text-[#004BCA] font-bold pb-4">{formatted}</p>
        <div className="w-20 p-2 text-sm bg-[#d0e1fb] rounded ">
          <p className="text-[#605f5f]">Stock : {stock}</p>
        </div>
      </div>
    </Card>
  );
}
