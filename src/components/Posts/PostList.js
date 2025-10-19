import { PostItem } from './PostItem';
import { getPosts, searchPosts } from '@/services/postService';
import { PostSearch } from './PostSearch';
import { Suspense } from 'react';
import { Post } from '@/types';

interface PostListProps {
  initialSearch?: string;
}

async function PostItems({ searchQuery }: { searchQuery?: string }) {
  try {
    const posts = searchQuery 
      ? await searchPosts(searchQuery)
      : await getPosts();

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No posts found matching your search.' : 'No posts available yet.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: Post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">
          Unable to load posts. Please try again later.
        </p>
      </div>
    );
  }
}

export default async function PostList({ initialSearch }: PostListProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <PostSearch initialQuery={initialSearch} />
      </header>
      
      <Suspense 
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        }
      >
        <PostItems searchQuery={initialSearch} />
      </Suspense>
    </section>
  );
}

export { PostList };