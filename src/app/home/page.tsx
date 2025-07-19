import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-xl w-full mx-auto bg-card rounded-2xl shadow-xl p-8 border border-border flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary">Welcome to E-Comzy</h1>
        <p className="text-lg text-center text-foreground mb-8">What would you like to do?</p>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link href="/create" className="w-full md:w-1/2 bg-primary text-white font-semibold py-4 rounded-lg text-center text-lg hover:bg-primary/90 transition">
            Create a New Store
          </Link>
          <Link href="/dashboard" className="w-full md:w-1/2 bg-card text-primary border border-primary font-semibold py-4 rounded-lg text-center text-lg hover:bg-primary hover:text-white transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
