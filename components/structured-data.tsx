export function LocalBusinessStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    name: 'Daydreamers',
    description: 'Ice cream and snacks for dogs at Brooklyn dog parks',
    url: 'https://daydreamersnyc.com',
    telephone: '(541) 359-5481',
    email: 'info@daydreamersnyc.com',
    areaServed: {
      '@type': 'City',
      name: 'Brooklyn',
      containedIn: 'New York'
    },
    priceRange: '$$',
    image: [
      'https://daydreamersnyc.com/images/Just Stanley and clouds.png'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
