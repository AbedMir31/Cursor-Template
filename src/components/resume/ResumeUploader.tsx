'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    processFile(selectedFile)
  }

  const processFile = (selectedFile?: File) => {
    if (selectedFile) {
      // Check if it's a LaTeX file (.tex extension)
      if (!selectedFile.name.endsWith('.tex')) {
        setError('Please upload a LaTeX (.tex) file')
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      // Set default title from filename without extension
      if (!title) {
        setTitle(selectedFile.name.replace(/\.tex$/, ''))
      }
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }
    
    setIsUploading(true)
    setError(null)
    
    try {
      // Read file content
      const fileContent = await file.text()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to upload a resume')
      }
      
      // Save to database
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          title,
          latex_content: fileContent,
          user_id: user.id
        })
        .select()
      
      if (error) throw error
      
      // Redirect to the resume detail page
      router.push(`/resumes/${data[0].id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading resume')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h2 className="text-xl font-bold mb-4">Upload Your LaTeX Resume</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Resume Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer Resume"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            LaTeX File
          </label>
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${file ? 'text-green-500' : 'text-gray-400'}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".tex"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">LaTeX (.tex) files only</p>
              {file && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 py-1 px-2 rounded">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>
    </div>
  )
} 