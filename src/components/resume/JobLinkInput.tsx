'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type JobLinkInputProps = {
  resumeId: string
}

export default function JobLinkInput({ resumeId }: JobLinkInputProps) {
  const [jobUrl, setJobUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    try {
      // Validate URL
      try {
        new URL(jobUrl)
      } catch {
        throw new Error('Please enter a valid URL')
      }

      // Process the job link and resume
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          jobUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to process the resume')
      }

      const { tailoredResumeId } = await response.json()
      
      // Redirect to the tailored resume page
      router.push(`/resumes/${tailoredResumeId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Tailor Your Resume</h2>
      
      <p className="mb-4 text-gray-600">
        Paste a job posting URL (LinkedIn preferred) to tailor your resume for this specific position.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobUrl">
            Job Posting URL
          </label>
          <input
            id="jobUrl"
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            required
            placeholder="https://www.linkedin.com/jobs/view/..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !jobUrl}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Tailor My Resume'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> This process will analyze the job posting and enhance your resume to highlight
          relevant skills and experiences. No false information will be added.
        </p>
      </div>
    </div>
  )
} 