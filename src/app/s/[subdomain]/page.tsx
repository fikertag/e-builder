import { Metadata } from 'next';

// DO NOT use async unless you're fetching
export function generateMetadata({ params }: { params: { subdomain: string } }): Metadata {
  return {
    title: `${params.subdomain}'s Page`,
  };
}

export default function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">
        This is your custom landing page for the subdomain.
      </p>
    </main>
  );
}
