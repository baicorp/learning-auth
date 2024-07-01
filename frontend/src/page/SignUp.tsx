import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";

export default function SignUp() {
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
      <h1 className="font-extrabold text-2xl text-center mb-10">
        Sing Up Account
      </h1>
      <div className="w-full flex flex-col justify-center items-center gap-2 max-w-[325px]">
        <LoginWithGoogleButton />
        <LoginWithGithubButton />
      </div>
      <div className="">
        <p className="font-semibold text-sm text-gray-500">Or</p>
      </div>
      <SignUpForm />
      <div>
        <p className="text-sm">
          Already have an account ?{" "}
          <Link className="text-blue-500" to="/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

function LoginWithGithubButton() {
  return (
    <button className="w-full border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50">
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="#000"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span>Sign in with Github</span>
    </button>
  );
}

function LoginWithGoogleButton() {
  return (
    <button className="w-full border border-gray-300 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 px-10 py-2 hover:bg-gray-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 48 48"
        viewBox="0 0 48 48"
        className="w-6 h-6"
      >
        <path
          d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-11.045 0-20 8.955-20 20s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          fill="#ffc107"
        />
        <path
          d="m6.306 14.691 6.571 4.819c1.778-4.402 6.084-7.51 11.123-7.51 3.059 0 5.842 1.154 7.961 3.039l5.657-5.657c-3.572-3.329-8.35-5.382-13.618-5.382-7.682 0-14.344 4.337-17.694 10.691z"
          fill="#ff3d00"
        />
        <path
          d="m24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.504 2.43-7.219 2.43-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025c3.31 6.477 10.032 10.921 17.805 10.921z"
          fill="#4caf50"
        />
        <path
          d="m43.611 20.083h-1.611v-.083h-18v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238c-.438.398 6.591-4.807 6.591-14.807 0-1.341-.138-2.65-.389-3.917z"
          fill="#1976d2"
        />
      </svg>
      <span>Sign in with Google</span>
    </button>
  );
}

function SignUpForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<formSchema>({
    reValidateMode: "onSubmit",
    mode: "onSubmit",
  });
  const password = watch("password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<formSchema> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/session/sign-up`,
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
        });
        return { success: false };
      }
      const user = await res.json();
      if (user?.success) {
        toast("Account created successfully", {
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
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
          className="text-sm font-semibold px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-none focus:outline-blue-500"
        />
        {errors.name && (
          <span className="font-bold text-red-500 text-xs">
            * name is required
          </span>
        )}
      </div>
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
      <div className="flex flex-col gap-0.5">
        <input
          type="password"
          placeholder="Repeat Password"
          {...register("repeatPassword", {
            minLength: 1,
            required: true,
            validate: (value) => value === password,
          })}
          className="text-sm font-semibold px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-none focus:outline-blue-500"
        />
        {errors.repeatPassword && (
          <span className="font-bold text-red-500 text-xs">
            * password does not match
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}

type formSchema = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};
