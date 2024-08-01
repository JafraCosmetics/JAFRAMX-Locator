import ConsultantFinder from "@/components/ConsultantFinder";

import "@/styles/App.min.css";
import "@/styles/tailwind.css";
import "@/styles/app.css";
import { getDictionary } from "@/dictionaries/dictionaries";

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang); // en

  return <ConsultantFinder dict={dict} />;
}
