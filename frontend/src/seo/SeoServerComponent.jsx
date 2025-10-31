"use server";

import Head from "next/head";

export default async function SeoServerComponent() {
  const title = "Suggest: Smart Reply – AI that Writes for You";
  const description =
    "Suggest Smart Reply helps you write faster and smarter using AI. Auto-generate smart responses, boost productivity, and make communication seamless.";
  const url = "";
  const image = "";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    image: image,
    publisher: {
      "@type": "Organization",
      name: "Mahmud Rahman",
      logo: {
        "@type": "ImageObject",
        url: "",
      },
    },
  };

  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Mahmud Rahman" />

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@YourTwitterHandle" />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}
