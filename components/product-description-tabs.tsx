'use client'

interface ProductDescriptionTabsProps {
  description: string
}

export function ProductDescriptionTabs({ description }: ProductDescriptionTabsProps) {
  // Parse description into sections based on keywords
  const sectionKeywords = ['Description', 'Ingredients', 'Guaranteed Analysis', 'Calorie Content']
  
  const sections = sectionKeywords.map(keyword => {
    const startIndex = description.indexOf(keyword)
    if (startIndex === -1) return null

    // Find the start of the next section
    const nextKeywordIndex = sectionKeywords
      .map(k => description.indexOf(k, startIndex + keyword.length))
      .filter(i => i > startIndex)
      .sort((a, b) => a - b)[0] || description.length

    return {
      title: keyword,
      content: description.slice(startIndex + keyword.length, nextKeywordIndex).trim()
    }
  }).filter((section): section is { title: string, content: string } => section !== null)

  if (sections.length === 0) {
    return (
      <div className="prose max-w-none">
        <div className="text-gray-600">
          {description}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="prose max-w-none">
          <h3 className="text-lg font-quicksand font-bold text-eggplant mb-2">
            {section.title}
          </h3>
          <div className="text-gray-600">
            {section.content}
          </div>
        </div>
      ))}
    </div>
  )
} 