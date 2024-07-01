export async function handleClickOAuth(provider: "github" | "google") {
  const res = await fetch(
    `${
      import.meta.env.VITE_BASE_URL
    }/api/auth/oauth/${provider}/getConcentScreen`
  );
  if (res.status !== 200) {
    console.log("Somthing went wrong (res)");
  }
  const data = await res.json();
  if (!data) {
    console.log("Somthing went wrong (data)");
  }

  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    data?.url,
    "oauthWindow",
    `width=${width},height=${height},top=${top},left=${left}`
  );
}
