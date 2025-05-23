import { Metadata } from 'next';

type PageProps = {
  params: {
    subdomain: string;
  };
};

// ✅ This must return a plain object, not a Promise
export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `Welcome, ${params.subdomain}`,
  };
}

// ✅ Also not async unless you're doing data fetching
export default function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">This is your custom subdomain page.</p>
    </main>
  );
}
