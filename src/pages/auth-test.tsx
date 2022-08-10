import { NextPage } from "next";
import { requireAuth } from "../utils/requireAuth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const AuthTest: NextPage = () => {
  return (
    <div>
      <h1>Auth Test</h1>
    </div>
  );
};

export default AuthTest;
