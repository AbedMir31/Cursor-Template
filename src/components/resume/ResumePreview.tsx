'use client'

import { useState, useEffect } from 'react'
import { TailoredResume } from '@/lib/types'

type ResumePreviewProps = {
  resume: TailoredResume | { latex_content: string; id: string }
  isTailored?: boolean
}

export default function ResumePreview({ resume, isTailored = false }: ResumePreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generatePdf = async () => {
      try {
        setIsLoading(true)
        
        // Call API to render LaTeX as PDF
        const response = await fetch('/api/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latexContent: resume.latex_content,
          }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to generate PDF')
        }
        
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error rendering PDF')
      } finally {
        setIsLoading(false)
      }
    }
    
    generatePdf()
    
    // Cleanup
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [resume.latex_content])

  const handleDownload = () => {
    if (!pdfUrl) return
    
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `resume-${isTailored ? 'tailored' : 'original'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-bold">
          {isTailored ? 'Tailored Resume Preview' : 'Resume Preview'}
        </h3>
        <button
          onClick={handleDownload}
          disabled={isLoading || !pdfUrl}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>
      
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="h-96 flex items-center justify-center p-4 text-red-500">
          {error}
        </div>
      ) : (
        <div className="h-96 overflow-auto">
          {pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full"
              title="Resume Preview"
            />
          ) : (
            <div className="p-4 text-gray-500">No preview available</div>
          )}
        </div>
      )}
    </div>
  )
} 