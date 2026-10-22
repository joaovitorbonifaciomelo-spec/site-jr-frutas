import Script from "next/script";
import { GTM_ID } from "@/data/site";

/**
 * Google Tag Manager — CONFIGURÁVEL e DESLIGADO por padrão.
 * Só carrega com NEXT_PUBLIC_GTM_ID definido (ex.: GTM-P7K9X4MP, o container do
 * site legado — ativar somente depois de validar o que existe dentro dele).
 * RD Station / Nectar do legado NÃO são reativados.
 */
const id = GTM_ID && /^GTM-[A-Z0-9]+$/.test(GTM_ID) ? GTM_ID : null;

export function GtmScript() {
  if (!id) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

export function GtmNoScript() {
  if (!id) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  );
}
