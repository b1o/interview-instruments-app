import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "server/router";
import superjson from "superjson";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { ExclamationIcon } from "@heroicons/react/solid";

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
    // No clue how to pass session/user related data to the context in order to perfom the auth check, quite unfortunate
    // Could probably move away from TRPC and build a simple express but there's too much built at this point
    // Maybe if I could somehow get access to the request data for the generated page, but I can't find info about it
    // Moral of the story: don't use new born tech for interviews, although TRPC is quite nice for everything else
    ctx: {
      bypass: process.env.INSTRUMENTS_API_URL,
      prisma,
    } as any,
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
    { retry: false }
  );
  const router = useRouter();

  const { data, error } = instrumentQuery;

  if (error && error.data?.httpStatus === 401) {
    return (
      <div className="flex h-full w-full justify-center items-start pt-10">
        <div className="p-5 border border-red-500 bg-white rounded-lg shadow-lg">
          <span className="text-red-500 items-center text-5x1 font-bold flex">
            <ExclamationIcon width="64px" />
            You have no access to this page
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="p-5">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default InstrumentDetails;
