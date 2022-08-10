import { Instrument } from "@prisma/client";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

const Instrument = ({ instrument }: { instrument: Instrument }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      maximumFractionDigits: 10,
      currency: "USD",
    }).format(amount);
  };

  return (
    <Link href={`/instruments/${instrument.instrument_symbol}`}>
      <div className="hover:scale-105 group cursor-pointer transition-transform rounded-lg shadow-sm relative bg-white flex-grow">
        <div className="header p-3 flex items-center gap-4">
          <div className="image h-[50px] relative">
            <Image
              src={instrument.image}
              width="50px"
              height="50px"
              alt={instrument.instrument_name}
            />
          </div>
          <div className="info flex flex-col">
            <div className="name font-bold text-lg">
              {instrument.instrument_name}
            </div>
            <div className="font-bold">
              Current Price:
              <span className="font-normal">
                {formatCurrency(instrument.usd_price)}
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="group-hover:mt-1 transition-all">
              <ArrowRightIcon width="24px" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Instrument;
