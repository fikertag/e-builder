import { Header } from "@/components/header";

export default async function Home() {
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
