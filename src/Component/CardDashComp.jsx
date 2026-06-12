import { Card } from "flowbite-react/components/Card";

export default function CardDashComp({
  title,
  Icon,
  wBadge,
  Iconcolor,
  Iconbg,
  badgcolor,
  badgetextcolor,
  Iconbadg,
  badgvalue,
  subtitle,
  isSalary,
  cardValue,
  persen,
}) {
  return (
    <>
      <Card style={{ width: "100%", height: "auto", padding: "0px" }}>
        <div className="flex justify-between">
          <div
            className={`p-2 w-8 ${Iconbg} rounded`}
            style={{ alignItems: "center" }}
          >
            {Icon && <Icon color={Iconcolor} className="font-bold" />}
          </div>
          <div
            className={`flex ${badgcolor} ${wBadge} h-5 gap-2 rounded ${badgetextcolor} p-2 `}
            style={{ alignItems: "center" }}
          >
            {Iconbadg && <Iconbadg className="text-1xl" />}
            <p style={{ fontSize: "12px" }}>{badgvalue}</p>
          </div>
        </div>
        <div>
          <h1 className="font-semibold text-sm">{title}</h1>
          <p className="font-bold text-2xl mb-5">{cardValue}</p>
          {isSalary == "income" && (
            <div className="">
              <div className="bg-gray-300 rounded w-full h-1"></div>
              <div
                className={`bg-[#2563eb] rounded ${persen} h-1 relative bottom-1`}
              ></div>
            </div>
          )}
          <p style={{ fontSize: "12px" }}>{subtitle}</p>
        </div>
      </Card>
    </>
  );
}
