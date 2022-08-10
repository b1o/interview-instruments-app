import { Form, useForm } from "@/components/ui/form/Form";
import InputField from "@/components/ui/form/InputField";
import { ILogin, loginSchema } from "common/validation/auth";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const Login: NextPage = () => {
  const form = useForm({
    schema: loginSchema,
  });
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const onSubmit = useCallback(async (data: ILogin) => {
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.ok) {
      router.push("/auth-test");
    } else {
      setLoginError('Invalid Credentials');
    }
  }, [router]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-5">Login</h1>
      {loginError && <div className="text-red-500 p-3">{loginError}</div>}
      <Form
        className="w-[400px] bg-slate-200 p-5 rounded-lg shadow"
        form={form}
        onSubmit={onSubmit}
      >
        <InputField label="Email" type="email" {...form.register("email")} />
        <InputField
          label="Password"
          type="password"
          {...form.register("password")}
        />
        <button
          className="shadow w-full mt-3 rounded px-3 py-2 bg-blue-600 text-slate-100"
          type="submit"
        >
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
