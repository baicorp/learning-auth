import useSWR from "swr";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const { data, isLoading } = useSWR("user", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/current-user`
    );
    // check if user already login, if no, redirect to sign-in
    if (res.status !== 200) {
      navigate("/sign-in");
    }
    const user = await res.json();
    return user;
  });

  return isLoading ? (
    <main className="h-dvh flex justify-center items-center text-2xl font-extrabold">
      Loading. . .
    </main>
  ) : (
    <main className="h-dvh flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl md:text-3xl text-center font-extrabold absolute top-20 left-1/2 -translate-x-1/2">
        This page is protected, only for authenticated user
      </h1>
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
        <button
          className="bg-black text-white font-semibold px-3 py-2 rounded-lg hover:bg-[#000d]"
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
      </div>
    </main>
  );
}

export default App;
