import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProjectContent } from '@/components/projects/ProjectContent'
import { ProjectMeta } from '@/components/projects/ProjectMeta'
import { RelatedProjects } from '@/components/projects/RelatedProjects'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { Project } from '@/types'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all projects (for static generation)
export async function generateStaticParams() {
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug')
      .eq('is_public', true)

    return projects?.map((project) => ({
      slug: project.slug,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each project
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { data: project } = await supabase
      .from('projects')
      .select(`
        title,
        description,
        featured_image_url,
        created_at,
        author:profiles(full_name)
      `)
      .eq('slug', params.slug)
      .eq('is_public', true)
      .single()

    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
      }
    }

    const title = project.title
    const description = project.description || 'Explore this project on Glenn Geraghty\'s developer portfolio.'
    const author = project.author?.full_name || 'Glenn Geraghty'

    return {
      title: `${title} | Glenn Geraghty`,
      description,
      keywords: ['project', 'portfolio', 'web development', title],
      authors: [{ name: author }],
      openGraph: {
        title: `${title} | Glenn Geraghty`,
        description,
        type: 'article',
        url: `/projects/${params.slug}`,
        images: project.featured_image_url ? [
          {
            url: project.featured_image_url,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
        publishedTime: project.created_at,
        authors: [author],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Glenn Geraghty`,
        description,
        images: project.featured_image_url ? [project.featured_image_url] : [],
        creator: '@glenngeraghty',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Project | Glenn Geraghty',
      description: 'Explore this project on Glenn Geraghty\'s developer portfolio.',
    }
  }
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const { data: project, error } = await supabase
      .from('projects')
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
        project_tags(
          tags(
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_public', true)
      .single()

    if (error || !project) {
      return null
    }

    // Transform the data to match our Project type
    const transformedProject: Project = {
      ...project,
      tags: project.project_tags?.map((pt: any) => pt.tags) || []
    }

    return transformedProject
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.featured_image_url,
    author: {
      '@type': 'Person',
      name: project.author?.full_name || 'Glenn Geraghty',
      url: project.author?.website_url,
    },
    creator: {
      '@type': 'Person',
      name: 'Glenn Geraghty',
      url: 'https://glenngeraghty.dev',
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at,
    url: `/projects/${project.slug}`,
    programmingLanguage: project.tech_stack,
    codeRepository: project.github_url,
    applicationCategory: 'WebApplication',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative">
          {project.featured_image_url && (
            <div className="aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1] overflow-hidden">
              <img
                src={project.featured_image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className={project.featured_image_url ? 'text-white' : 'text-gray-900 dark:text-white'}>
              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="mt-6 text-xl leading-relaxed opacity-90">
                  {project.description}
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
              {/* Project Meta */}
              <ProjectMeta project={project} />

              {/* Project Content */}
              {project.content && (
                <div className="mt-8">
                  <ProjectContent content={project.content} />
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <ShareButtons 
                  url={`/projects/${project.slug}`}
                  title={project.title}
                  description={project.description || ''}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-12 lg:mt-0">
              <div className="sticky top-8 space-y-8">
                {/* Related Projects */}
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
                  <RelatedProjects 
                    currentProjectId={project.id}
                    techStack={project.tech_stack || []}
                    tags={project.tags?.map(tag => tag.id) || []}
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
