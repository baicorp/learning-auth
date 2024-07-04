import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

export default function About() {
  const navigate = useNavigate();

  const { isLoading } = useSWR("user", async () => {
    const res = await fetch(`/api/auth/current-user`);
    // check if user already login, if no, redirect to sign-in
    if (res.status !== 200) {
      const user = await res.json();
      toast(user.message, {
        className: "bg-red-500 text-white",
      });
      navigate("/sign-in");
    }
    const user = await res.json();
    return user;
  });
  return isLoading ? null : (
    <main className="h-dvh flex flex-col justify-center items-center gap-5">
      <h1 className="text-xl md:text-3xl text-center font-extrabold absolute top-20 left-1/2 -translate-x-1/2">
        This is About page (protected)
      </h1>
      <p className="text-center">
        Browse freely between home and about page. Inactive for 30 seconds?
        You'll be logged out automatically.
      </p>
      <Link
        to={"/"}
        className="bg-black text-white font-semibold px-3 py-2 border border-slate-900 rounded-lg hover:bg-gray-800"
      >
        Home
      </Link>
    </main>
  );
}
