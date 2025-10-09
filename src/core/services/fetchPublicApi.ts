export async function FetchPublicApi<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    next: { revalidate },
  }); 

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}