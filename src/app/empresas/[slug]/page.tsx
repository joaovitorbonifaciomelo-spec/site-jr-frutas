import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompanyPage } from "@/components/empresas/CompanyPage";
import { companies, companyBySlug, companyHref } from "@/data/companies";
import { pageMetadata } from "@/lib/seo";

/** Só as 4 operações cadastradas; qualquer outro slug → 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = companyBySlug(slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.name} — operação da JR Frutas`,
    description: c.metaDescription,
    path: companyHref(c),
    image: `/og/${c.slug}.jpg`,
    absolute: true,
  });
}

export default async function EmpresaPage({ params }: Props) {
  const { slug } = await params;
  const c = companyBySlug(slug);
  if (!c) notFound();
  return (
    <>
      <Header />
      <main id="conteudo">
        <CompanyPage company={c} />
      </main>
      <Footer />
    </>
  );
}
