export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  return <div>welcome : {subdomain}</div>
}