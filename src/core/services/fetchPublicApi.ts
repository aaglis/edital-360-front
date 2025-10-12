export async function FetchPublicApi<T>(
  path: string,
  revalidate = 60,
  //eslint-disable-next-line
  queries?: Record<string, any>
): Promise<T> {
  // monta query string
  const queryString = queries
    ? '?' + new URLSearchParams(queries).toString()
    : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}${queryString}`,
    {
      next: { revalidate },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
