import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';

interface PostItemProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedAt: string;
    readingTime: number;
    coverImage?: string;
    tags?: string[];
  };
  priority?: boolean;
}

export default function PostItem({ post, priority = false }: PostItemProps) {
  const {
    id,
    title,
    slug,
    excerpt,
    author,
    publishedAt,
    readingTime,
    coverImage,
    tags
  } = post;

  const formattedDate = formatDate(publishedAt);
  const postUrl = `/posts/${slug}`;

  return (
    <article 
      className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-300"
      data-post-id={id}
    >
      <Link href={postUrl} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
        {coverImage && (
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <img
              src={coverImage}
              alt={`${title} cover image`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading={priority ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={`${author.name}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{author.name}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={publishedAt}>{formattedDate}</time>
              <span aria-hidden="true">•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h2>
          
          <p className="text-gray-600 line-clamp-3 mb-4">
            {excerpt}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <span className="absolute inset-0" aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}