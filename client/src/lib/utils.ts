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
    return `<p class="mb-2">${paragraph}</p>`;
  }).join('');
  
  // Handle bulleted lists
  formatted = formatted.replace(/<p class="mb-2">• (.*?)<\/p>/g, '<li>$1</li>');
  formatted = formatted.replace(/<li>(.*?)<\/li>/g, function(match) {
    return '<ul class="list-disc pl-6 mb-3 space-y-1">' + match + '</ul>';
  });
  
  // Handle numbered lists
  formatted = formatted.replace(/<p class="mb-2">\d+\. (.*?)<\/p>/g, '<li>$1</li>');
  formatted = formatted.replace(/<li>(.*?)<\/li>/g, function(match) {
    return '<ol class="list-decimal pl-6 mb-3 space-y-1">' + match + '</ol>';
  });
  
  // Deduplicate lists
  formatted = formatted.replace(/<\/ul><ul class="list-disc pl-6 mb-3 space-y-1">/g, '');
  formatted = formatted.replace(/<\/ol><ol class="list-decimal pl-6 mb-3 space-y-1">/g, '');
  
  // Handle bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return formatted;
}
