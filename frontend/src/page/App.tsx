import useSWR from "swr";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function App() {
  const navigate = useNavigate();

  const { data, isLoading } = useSWR("user", async () => {
    const res = await fetch(`/api/auth/current-user`);
    // check if user already login, if no, redirect to sign-in
    console.log(res);
    if (res.status !== 200) {
      const user = await res.json();
      toast(user.message, {
        className: "bg-red-500 text-white",
      });
      navigate("/sign-in");
    }
    const user = await res.json();
    console.log(user);
    return user;
  });

  return isLoading ? (
    <main className="h-dvh flex justify-center items-center text-2xl font-extrabold">
      Loading. . .
    </main>
  ) : (
    <main className="h-dvh flex flex-col justify-center items-center gap-5">
      <h1 className="text-xl md:text-3xl text-center font-extrabold absolute top-20 left-1/2 -translate-x-1/2">
        This page is protected, only for authenticated user
      </h1>
      <p className="text-center">
        Browse freely between home and about page. Inactive for 30 seconds?
        You'll be logged out automatically.
      </p>
      <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-xl transition-all hover:shadow-md hover:shadow-gray-300">
        {data?.picture ? (
          <img
            src={data?.picture}
            alt="profile-picture"
            className="w-12 h-12 rounded-full"
          />
        ) : null}
        <div>
          <p className="font-extrabold text-xl">{data?.name}</p>
          <p className="font-semibold text-gray-500">{data?.email}</p>
        </div>
      </div>
      <div>
        <Link
          to={"/about"}
          className="bg-black text-white font-semibold px-3 py-2 border border-slate-900 rounded-lg hover:bg-gray-800"
        >
          About
        </Link>
      </div>
      <button
        className="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-600 mt-10"
        onClick={async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BASE_URL}/api/auth/logout`
            );
            if (res.status !== 200) {
              console.log("something wrong when logout");
            }
            const logout = await res.json();
            if (!logout) {
              console.log("something wrong when logout");
            }
            navigate("/sign-in");
          } catch (e) {
            return { success: false };
          }
        }}
      >
        Logout
      </button>
    </main>
  );
}

export default App;
