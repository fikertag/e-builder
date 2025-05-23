import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { subdomain: string } }): Metadata {
  return {
    title: `Welcome, ${params.subdomain}`,
  };
}

export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {params.subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">This is your custom subdomain page.</p>
    </main>
  );
}