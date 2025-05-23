import { Metadata } from 'next';

// Rename the type to avoid conflict with Next.js's generated types
type SubdomainPageProps = {
  params: {
    subdomain: string;
  };
};

export function generateMetadata({ params }: SubdomainPageProps): Metadata {
  return {
    title: `Welcome, ${params.subdomain}`,
  };
}

export default function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">This is your custom subdomain page.</p>
    </main>
  );
}