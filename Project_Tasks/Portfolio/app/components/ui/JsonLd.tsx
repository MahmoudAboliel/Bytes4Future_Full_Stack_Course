type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Structured data for search engines. Rendered inline in the page body. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
