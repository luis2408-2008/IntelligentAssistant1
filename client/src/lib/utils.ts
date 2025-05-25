import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function escapeHTML(str: string): string {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
}

export function formatMessageText(content: string): string {
  // Convert line breaks to paragraphs
  let formatted = content.split('\n\n').map(paragraph => {
    if (paragraph.trim() === '') return '';
    return `<p class="mb-3">${paragraph}</p>`;
  }).join('');
  
  // Handle headings (markdown style)
  formatted = formatted.replace(/<p class="mb-3">#{3} (.*?)<\/p>/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  formatted = formatted.replace(/<p class="mb-3">#{2} (.*?)<\/p>/g, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>');
  formatted = formatted.replace(/<p class="mb-3"># (.*?)<\/p>/g, '<h1 class="text-2xl font-bold mt-5 mb-3">$1</h1>');
  
  // Handle bulleted lists
  formatted = formatted.replace(/<p class="mb-3">• (.*?)<\/p>/g, '<li class="mb-1.5">$1</li>');
  formatted = formatted.replace(/<p class="mb-3">- (.*?)<\/p>/g, '<li class="mb-1.5">$1</li>');
  formatted = formatted.replace(/<li class="mb-1.5">(.*?)<\/li>/g, function(match) {
    return '<ul class="list-disc pl-6 mb-4 mt-2 space-y-1">' + match + '</ul>';
  });
  
  // Handle numbered lists
  formatted = formatted.replace(/<p class="mb-3">\d+\. (.*?)<\/p>/g, '<li class="mb-1.5">$1</li>');
  formatted = formatted.replace(/<li class="mb-1.5">(.*?)<\/li>/g, function(match) {
    return '<ol class="list-decimal pl-6 mb-4 mt-2 space-y-1">' + match + '</ol>';
  });
  
  // Deduplicate lists
  formatted = formatted.replace(/<\/ul><ul class="list-disc pl-6 mb-4 mt-2 space-y-1">/g, '');
  formatted = formatted.replace(/<\/ol><ol class="list-decimal pl-6 mb-4 mt-2 space-y-1">/g, '');
  
  // Handle text formatting
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-sm font-mono bg-gray-100 dark:bg-gray-700">$1</code>');
  
  // Handle links
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">$1</a>');
  
  // Handle horizontal rule
  formatted = formatted.replace(/<p class="mb-3">---<\/p>/g, '<hr class="my-6 border-t border-gray-200 dark:border-gray-700">');
  
  return formatted;
}
