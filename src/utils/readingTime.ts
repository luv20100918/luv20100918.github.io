export function calculateReadingTime(content: string): { minutes: number; text: string } {
  // Remove HTML tags and MDX components
  const text = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to text
    .replace(/[#*_~]/g, '') // Remove markdown formatting
    .trim();

  // Korean and English word counting
  // Korean: count characters (한글은 글자 수로 계산)
  // English: count words (영어는 단어 수로 계산)
  
  // Split by spaces to get words
  const words = text.split(/\s+/);
  
  let totalCount = 0;
  
  words.forEach(word => {
    // Check if word contains Korean characters
    if (/[\u3131-\uD79D]/.test(word)) {
      // Korean: count characters (average 300 chars/min)
      totalCount += word.length / 300;
    } else if (word.length > 0) {
      // English: count as word (average 200 words/min)
      totalCount += 1 / 200;
    }
  });
  
  // Calculate minutes, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(totalCount));
  
  // Generate text
  const readingText = minutes === 1 ? '1분' : `${minutes}분`;
  
  return {
    minutes,
    text: readingText
  };
}

// Helper function to get reading time from markdown/MDX content
export function getReadingTime(content: string): string {
  const { text } = calculateReadingTime(content);
  return text;
}