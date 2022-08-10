import Instrument from "@/components/ui/instrument/instrument";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { requireAuth } from "utils/requireAuth";
import { trpc } from "utils/trpc";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Instruments = () => {
  const { data: sessionData } = useSession();
  const { data, error } = trpc.useQuery(["instruments.get"]);
  const {
    mutate,
    error: updateError,
  } = trpc.useMutation(["instruments.update"]);

  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600">{error.message}</div>
      </div>
    );

  if (updateError)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600">{updateError.message}</div>
      </div>
    );

  const forceUpdateButton = () => {
    if (sessionData?.id) {
      return (
        <button
          onClick={() => mutate()}
          className="p-3 ml-auto bg-blue-500 text-white rounded-lg shadow-lg "
        >
          Force Update
        </button>
      );
    }

    return null;
  };

  return (
    <div className="p-5">
      <div className="flex w-full">
        <h1 className="text-4xl font-bold">Instruments</h1>
        {forceUpdateButton()}
      </div>
      <div className="flex justify-center items-center h-full mt-5">
        <div className="instruments grid grid-cols-3 gap-4 w-full">
          {data?.result.map((instrument) => (
            <Instrument key={instrument.id} instrument={instrument} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instruments;
