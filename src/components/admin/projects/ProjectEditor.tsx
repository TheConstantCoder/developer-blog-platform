'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  DocumentIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeBracketIcon,
  StarIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface Technology {
  id: string
  name: string
  slug: string
  color: string
}

interface ProjectEditorProps {
  projectId?: string
}

export function ProjectEditor({ projectId }: ProjectEditorProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [availableTechnologies, setAvailableTechnologies] = useState<Technology[]>([])
  const [status, setStatus] = useState<'active' | 'completed' | 'archived'>('active')
  const [featured, setFeatured] = useState(false)
  const [demoUrl, setDemoUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTechnologies()
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !projectId) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
    }
  }, [title, projectId])

  const fetchTechnologies = async () => {
    try {
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching technologies:', error)
        return
      }

      setAvailableTechnologies(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchProject = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_technologies(technology_id)
        `)
        .eq('id', projectId)
        .single()

      if (error) {
        console.error('Error fetching project:', error)
        return
      }

      setTitle(data.title)
      setSlug(data.slug)
      setDescription(data.description || '')
      setStatus(data.status)
      setFeatured(data.featured || false)
      setDemoUrl(data.demo_url || '')
      setGithubUrl(data.github_url || '')
      setSelectedTechnologies(data.project_technologies?.map((pt: any) => pt.technology_id) || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      setSaving(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to save projects')
        return
      }

      const projectData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        status: status,
        featured: featured,
        demo_url: demoUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        author_id: user.id
      }

      let savedProject
      
      if (projectId) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .select()
          .single()

        if (error) {
          console.error('Error updating project:', error)
          alert('Error updating project')
          return
        }
        
        savedProject = data
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (error) {
          console.error('Error creating project:', error)
          alert('Error creating project')
          return
        }
        
        savedProject = data
      }

      // Update technologies
      if (savedProject) {
        // Remove existing technologies
        await supabase
          .from('project_technologies')
          .delete()
          .eq('project_id', savedProject.id)

        // Add new technologies
        if (selectedTechnologies.length > 0) {
          const techInserts = selectedTechnologies.map(techId => ({
            project_id: savedProject.id,
            technology_id: techId
          }))

          await supabase
            .from('project_technologies')
            .insert(techInserts)
        }
      }

      alert('Project saved successfully!')
      router.push('/admin/projects')
      
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    } finally {
      setSaving(false)
    }
  }

  const toggleTechnology = (techId: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                !previewMode
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <DocumentIcon className="w-4 h-4 inline mr-2" />
              Edit
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                previewMode
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'completed' | 'archived')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            
            <button
              onClick={saveProject}
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
            >
              <CheckCircleIcon className="w-4 h-4 inline mr-2" />
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {!previewMode ? (
            <>
              {/* Title */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <input
                  type="text"
                  placeholder="Enter project title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Slug */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="project-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* URLs */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-demo.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CodeBracketIcon className="w-4 h-4 inline mr-1" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Markdown)
                </label>
                <textarea
                  placeholder="Write your project description in Markdown..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title || 'Untitled Project'}
              </h1>
              
              {/* URLs */}
              {(demoUrl || githubUrl) && (
                <div className="flex space-x-4 mb-6">
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                      <CodeBracketIcon className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  )}
                </div>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap">{description}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technologies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              <CodeBracketIcon className="w-5 h-5 inline mr-2" />
              Technologies
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableTechnologies.map((tech) => (
                <label key={tech.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTechnologies.includes(tech.id)}
                    onChange={() => toggleTechnology(tech.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Project Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Settings
            </h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <StarIcon className="w-4 h-4 ml-2 mr-1 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Featured Project
                </span>
              </label>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Project Info
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>Words: {description.split(' ').filter(word => word.length > 0).length}</div>
              <div>Characters: {description.length}</div>
              <div>Status: {status}</div>
              <div>Featured: {featured ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
