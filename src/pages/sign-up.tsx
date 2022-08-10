import { NextPage } from "next";
import { ISignUp, signUpSchema } from "../common/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { useCallback } from "react";
import { useRouter } from "next/router";
import InputField from "@/components/ui/form/InputField";
import { Form, useForm } from "@/components/ui/form/Form";
import test from "node:test";

const SingUp: NextPage = () => {
  const form = useForm({
    schema: signUpSchema,
  });

  const router = useRouter();
  const { isLoading, error, mutateAsync } = trpc.useMutation("auth.signup");

  const onSubmit = useCallback(
    async (data: ISignUp) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        router.push("/login");
      }
    },
    [mutateAsync, router]
  );


  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-5">Sign up</h1>
      <Form
        className="w-[400px] bg-slate-200 p-5 rounded-lg shadow"
        form={form}
        onSubmit={onSubmit}
      >
        <InputField label="Email" type="email" {...form.register("email")} />
        <InputField
          label="Username"
          type="text"
          {...form.register("username")}
        />
        <InputField
          label="Password"
          type="password"
          {...form.register("password")}
        />
        <button
          className="shadow w-full mt-3 rounded px-3 py-2 bg-blue-600 text-slate-100"
          type="submit"
        >
          Sign Up
        </button>
      </Form>
    </div>
  );
};

export default SingUp;
