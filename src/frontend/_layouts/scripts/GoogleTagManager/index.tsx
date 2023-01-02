import Script from "next/script";

export function GoogleTagManager() {
  const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

  if (!GOOGLE_TAG_ID) {
    return null;
  }

  return (
    <div>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GOOGLE_TAG_ID}');
        `}
      </Script>
    </div>
  );
}
