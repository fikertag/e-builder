import { Metadata } from 'next';

interface Props {
  params: { subdomain: string };
}

// Optional: update title
export async function generateMetadata({ params }: { params: { subdomain: string } }): Promise<Metadata> {
  return {
    title: `${params.subdomain}'s Page`,
  };
}

export default function SubdomainPage({ params }: Props) {
  const { subdomain } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">Welcome to your custom landing page.</p>
    </main>
  );
}
