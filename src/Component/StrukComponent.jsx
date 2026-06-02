export default function StrukComponent({ ref, transactionItems }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 400px 20px 400px",
      }}
      ref={ref}
    >
      <h1 className="text-3xl  ">Nama Store</h1>

      <div className="border-b-2 border-dashed border-gray-200 mt-5"></div>

      <div className="pt-5">
        <div className="flex justify-between">
          <div>Receipt Id :</div>
          <div className="font-bold">Trx-29292-2992</div>
        </div>
        <div className="flex justify-between">
          <div>Cashier :</div>
          <div>HabibieBre</div>
        </div>
        <div className="flex justify-between">
          <div>Tanggal :</div>
          <div>30-05-2026</div>
        </div>
        <div className="flex justify-between">
          <div>Waktu :</div>
          <div>14:20</div>
        </div>
      </div>
      <div className="border-b-2 border-dashed border-gray-200 mt-5 mb-4"></div>
      <div>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead className="border-b-1 border-dashed border-gray-500 my-5">
            <tr>
              <th>Barang</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactionItems?.map((item) => (
              <tr
                className="border-b-1 border-gray-300 h-10 my-5"
                style={{ padding: "" }}
              >
                <td>{item.name}</td>
                <td>x {item.quantity}</td>
                <td>Rp. {item.price}</td>
                <td>Rp. {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-b-2 border-dashed border-gray-200 mt-5 mb-3"></div>
        <div className="">
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div>Rp. 20.000</div>
          </div>
          <div className="flex justify-between">
            <div>Pajak (5%)</div>
            <div>Rp. 5.000</div>
          </div>
          <div className="flex justify-between font-bold text-2xl">
            <div>Total</div>
            <div>Rp. 25.000</div>
          </div>
        </div>
        <div className="border-b-2 border-dashed border-gray-200 mt-5 mb-3"></div>
        <div className="font-bold text-2xl">
          <h1>Terimakasih Sudah Berbelanja!</h1>
        </div>
      </div>
    </div>
  );
}
