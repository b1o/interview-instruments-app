import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const {data} = useSession()
  console.log(data)
  return (
    <div className="flex p-5 shadow-md bg-slate-20 font-bold">
      <div className="title gap-4 flex">
        <Link href="/">Interview App</Link>
        <span>{data?.user?.email}</span>
        <span>{data?.user?.id}</span>
      </div>
      <div className="flex-grow"></div>
      <div className="actions flex gap-4">
        {!data ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/sign-up">Sign up</Link>
          </>
        ) : (
          <>
            <Link href="/instruments">Instruments</Link>
            <button onClick={() => signOut({callbackUrl: '/'})}>Sign Out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
