typescript
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import postService from '@/services/postService';
import { formatDate } from '@/utils/dateFormatter';
import { sanitizeHtml, truncateText } from '@/utils/textFormatter';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: {
    readTime?: number;
    likes?: number;
    views?: number;
  };
}

interface PostDetailProps {
  initialPost?: Post;
}

export default function PostDetail({ initialPost }: PostDetailProps) {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPost) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPost = await postService.getPostById(postId);
        if (!fetchedPost) {
          setError('Post not found');
          return;
        }
        setPost(fetchedPost);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, initialPost]);

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Post not found'}
          </h1>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <span>(Updated {formatDate(post.updatedAt)})</span>
            )}
            {post.metadata?.readTime && (
              <span>{post.metadata.readTime} min read</span>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-700 italic mb-6">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHtml(post.content) 
          }}
        />

        {/* Footer with actions */}
        <footer className="border-t pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {post.metadata?.views !== undefined && (
                <span>{post.metadata.views} views</span>
              )}
              {post.metadata?.likes !== undefined && (
                <span>{post.metadata.likes} likes</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Share
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </footer>

        {/* Related posts section could be added here */}
      </div>
    </article>
  );
}

// Server-side data fetching for static generation
export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const post = await postService.getPostById(params.id);
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialPost: post,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const posts = await postService.getAllPosts();
    const paths = posts.map((post: Post) => ({
      params: { id: post.id },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}