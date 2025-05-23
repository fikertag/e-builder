import { Metadata } from 'next';

export const generateMetadata = ({ params }: { params: { subdomain: string } }): Metadata => ({
  title: `Welcome, ${params.subdomain}`
});

export default function SubdomainPage(props: { params: { subdomain: string } }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Hello, {props.params.subdomain}!</h1>
      <p className="text-lg text-gray-600 mt-2">This is your custom subdomain page.</p>
    </main>
  );
}