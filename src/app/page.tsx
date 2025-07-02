import { Header } from "@/components/header";

export default async function Home() {
  // const res = await fetch("https://verifyapi.leulzenebe.pro/verify-telebirr", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-api-key":
  //       "Y21jbTgwc2s3MDAzb25xMGtrNGVwM25wNy0xNzUxNDc2ODQwNDM2LXFteTZiamE3eWQ",
  //     // Authorization:
  //     //   "Bearer Y21jbTgwc2s3MDAzb25xMGtrNGVwM25wNy0xNzUxNDc2ODQwNDM2LXFteTZiamE3eWQ",
  //   },
  //   body: JSON.stringify({
  //     reference: "CG119ELRL9",
  //   }),
  // });

  // const data = await res.json();
  // console.log(data);

  return (
    <>
      <Header />
      <p className="text-lg mt-4 max-w-3xl mx-auto">
        This is the public landing page. After authentication, users will access
        protected routes.
      </p>
    </>
  );
}
