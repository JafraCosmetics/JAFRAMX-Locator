import "@/styles/App.min.css";
import "@/styles/tailwind.css";
import "@/styles/app.css";
import { getDictionary } from "@/dictionaries/dictionaries";
import ConsultantFinder from "@/components/ConsultantFinder";

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "es" },
    { lang: "pt" },
  ];
}

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return <ConsultantFinder dict={dict} />;
}
