import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostContent } from '@/components/blog/PostContent'
import { PostMeta } from '@/components/blog/PostMeta'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { PostComments } from '@/components/blog/PostComments'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for published posts
export async function generateStaticParams() {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published')
      .limit(100) // Limit for build performance

    return posts?.map((post) => ({
      slug: post.slug,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select(`
        title,
        excerpt,
        meta_title,
        meta_description,
        featured_image_url,
        published_at,
        author:profiles(full_name)
      `)
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      }
    }

    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt || 'Read this blog post on Glenn Geraghty\'s developer blog.'
    const publishedTime = post.published_at
    const author = post.author?.full_name || 'Glenn Geraghty'

    return {
      title,
      description,
      keywords: [
        'blog post',
        'web development',
        'programming',
        'tutorial',
        'software engineering'
      ],
      authors: [{ name: author }],
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/blog/${params.slug}`,
        images: post.featured_image_url ? [
          {
            url: post.featured_image_url,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
        publishedTime,
        authors: [author],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featured_image_url ? [post.featured_image_url] : undefined,
      },
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post',
      description: 'Read this blog post on Glenn Geraghty\'s developer blog.',
    }
  }
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(
          id,
          full_name,
          avatar_url,
          bio,
          github_username,
          website_url
        ),
        post_tags(
          tags(
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !post) {
      return null
    }

    // Transform the data to match our Post type
    const transformedPost: Post = {
      ...post,
      tags: post.post_tags?.map((pt: any) => pt.tags) || []
    }

    // Increment view count
    await supabase.rpc('increment_post_view_count', { post_id: post.id })

    return transformedPost
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image_url,
    author: {
      '@type': 'Person',
      name: post.author?.full_name || 'Glenn Geraghty',
      url: post.author?.website_url,
    },
    publisher: {
      '@type': 'Person',
      name: 'Glenn Geraghty',
      url: 'https://glenngeraghty.dev',
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative">
          {post.featured_image_url && (
            <div className="aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1] overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={post.featured_image_url ? 'text-white' : 'text-gray-900 dark:text-white'}>
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-6 text-xl leading-relaxed opacity-90">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Post Meta */}
              <PostMeta post={post} />

              {/* Post Content */}
              <div className="mt-8">
                <PostContent content={post.content} />
              </div>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <ShareButtons 
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>

              {/* Comments */}
              <div className="mt-12">
                <Suspense fallback={<LoadingSpinner />}>
                  <PostComments postId={post.id} />
                </Suspense>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-12 lg:mt-0">
              <div className="sticky top-8 space-y-8">
                {/* Related Posts */}
                <Suspense fallback={
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      </div>
                    ))}
                  </div>
                }>
                  <RelatedPosts 
                    currentPostId={post.id}
                    tags={post.tags?.map(tag => tag.id) || []}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
