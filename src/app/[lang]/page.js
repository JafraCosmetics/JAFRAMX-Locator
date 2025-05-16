import { getDictionary } from "@/dictionaries/dictionaries";

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "es" },
    { lang: "pt" },
  ];
}

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return <button>{dict.products?.cart}</button>;
}
