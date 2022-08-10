import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "server/router";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { ExclamationIcon } from "@heroicons/react/solid";
import { PrismaClient } from "@prisma/client";
import { createContext } from "server/router/context";

export async function getStaticPaths() {
  const instrument_symbols = await prisma?.instrument.findMany({
    select: {
      instrument_symbol: true,
    },
  });

  return {
    paths: instrument_symbols!.map((instrument) => ({
      params: {
        instrument_symbol: instrument.instrument_symbol,
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ instrument_symbol: string }>
) {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {
      ...(await createContext()),
      bypass: process.env.BYPASS_API_KEY as string,
    },
    transformer: superjson,
  });
  const instrument_symbol = context.params?.instrument_symbol as string;
  await ssg.fetchQuery("instruments.bySymbol", { instrument_symbol });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      instrument_symbol,
    },
    revalidate: 1,
  };
}

const InstrumentDetails = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { instrument_symbol } = props;
  const instrumentQuery = trpc.useQuery(
    [
      "instruments.bySymbol",
      {
        instrument_symbol,
      },
    ],
    { staleTime: 3000 }
  );

  const { data, error } = instrumentQuery;

  // if (error && error.data?.httpStatus === 401) {
  //   return (
  //     <div className="flex h-full w-full justify-center items-start pt-10">
  //       <div className="p-5 border border-red-500 bg-white rounded-lg shadow-lg">
  //         <span className="text-red-500 items-center text-5x1 font-bold flex">
  //           <ExclamationIcon width="64px" />
  //           You have no access to this page
  //         </span>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="p-5">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default InstrumentDetails;
