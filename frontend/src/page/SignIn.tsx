import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginWithGithubButton, LoginWithGoogleButton } from "../component";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();

  const { isLoading } = useSWR("user", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/current-user`
    );
    // check if user already login, if yes, redirect to home
    if (res.status === 200) {
      navigate("/");
    }
    return await res.json();
  });

  return isLoading ? (
    <main className="h-dvh flex justify-center items-center text-2xl font-extrabold">
      Loading. . .
    </main>
  ) : (
    <main className="h-dvh flex flex-col justify-center items-center gap-3 px-5">
      <h1 className="font-extrabold text-2xl text-center mb-10">Sign In</h1>
      <div className="w-full flex flex-col justify-center items-center gap-2 max-w-[325px]">
        <LoginWithGoogleButton />
        <LoginWithGithubButton />
      </div>
      <div className="">
        <p className="font-semibold text-sm text-gray-500">Or</p>
      </div>
      <SignInForm />
      <div>
        <p className="text-sm">
          Don't have an account ?{" "}
          <Link className="text-blue-500" to="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formSchema>({
    reValidateMode: "onSubmit",
    mode: "onSubmit",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<formSchema> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/session/sign-in`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      setLoading(false);
      if (res.status !== 200) {
        const user = await res.json();
        toast(user.message, {
          className: "bg-red-500 text-white",
          duration: 1500,
        });
        return { success: false };
      }
      const user = await res.json();
      if (user?.success) {
        toast("Wellcome back, 👋", {
          className: "bg-green-500 text-white",
        });
        navigate("/");
      }
    } catch (e) {
      return { success: false };
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[325px] flex flex-col gap-4"
    >
      <div className="flex flex-col gap-0.5">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="text-sm font-semibold px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-none focus:outline-blue-500"
        />
        {errors.email && (
          <span className="font-bold text-red-500 text-xs">
            * please enter a valid email
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <input
          type="password"
          placeholder="Password"
          {...register("password", { minLength: 1, required: true })}
          className="text-sm font-semibold px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-none focus:outline-blue-500"
        />
        {errors.password && (
          <span className="font-bold text-red-500 text-xs">
            * please enter a password
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-500 border-gray-400 hover:bg-gray-500" : ""
        } bg-black text-white w-full border border-gray-900 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2.5 hover:bg-[#000d] mt-5`}
      >
        {loading ? "Signing..." : "Sign in"}
      </button>
    </form>
  );
}

type formSchema = {
  email: string;
  password: string;
};
