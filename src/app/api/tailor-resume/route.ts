import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Parse request body
    const { resumeId, jobUrl } = await request.json()
    
    if (!resumeId || !jobUrl) {
      return NextResponse.json(
        { message: 'Resume ID and Job URL are required' },
        { status: 400 }
      )
    }
    
    // Get the original resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()
    
    if (resumeError || !resume) {
      return NextResponse.json(
        { message: 'Resume not found or access denied' },
        { status: 404 }
      )
    }
    
    // Scrape job data
    const jobData = await fetch(`${request.nextUrl.origin}/api/job-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobUrl }),
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to scrape job data')
      }
      return res.json()
    })
    
    // Use AI to tailor the resume
    const tailoredLatex = await tailorResume(resume.latex_content, jobData)
    
    // Save the tailored resume
    const { data: tailoredResume, error: saveError } = await supabase
      .from('tailored_resumes')
      .insert({
        original_resume_id: resumeId,
        job_url: jobUrl,
        job_title: jobData.title,
        company: jobData.company,
        latex_content: tailoredLatex,
        user_id: user.id
      })
      .select()
      .single()
    
    if (saveError) {
      return NextResponse.json(
        { message: 'Failed to save tailored resume' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Resume tailored successfully',
      tailoredResumeId: tailoredResume.id
    })
  } catch (error) {
    console.error('Error in tailor-resume:', error)
    return NextResponse.json(
      { message: 'Failed to tailor resume' },
      { status: 500 }
    )
  }
}

// Function to tailor resume using AI
async function tailorResume(
  latexContent: string, 
  jobData: {
    title: string;
    company: string;
    description: string;
    requirements: string[];
  }
): Promise<string> {
  // This is where you'd call your AI service (e.g., OpenAI)
  // For this example, we'll use a simplified implementation
  
  try {
    // Prepare the prompt for the AI
    const prompt = `
      I have a resume in LaTeX format and a job posting. Please tailor this resume for the job posting.
      
      JOB TITLE: ${jobData.title}
      COMPANY: ${jobData.company}
      JOB DESCRIPTION: ${jobData.description}
      JOB REQUIREMENTS:
      ${jobData.requirements.map(req => `- ${req}`).join('\n')}
      
      ORIGINAL RESUME (LaTeX format):
      ${latexContent}
      
      Please modify the LaTeX resume to better highlight relevant skills and experiences for this job.
      Important guidelines:
      1. Do not fabricate experiences or qualifications
      2. Focus on reorganizing, rewording, and highlighting existing information
      3. Optimize for ATS systems by including relevant keywords from the job posting
      4. Maintain the original LaTeX structure and formatting
      5. Return only the modified LaTeX code
    `
    
    // Call AI service (this is a placeholder - you would integrate with OpenAI or similar)
    // In a real implementation, replace this with your actual AI service call
    
    // For demonstration, we'll simulate AI enhancements
    const tailoredLatex = enhanceResumeForJob(latexContent, jobData)
    
    return tailoredLatex
  } catch (error) {
    console.error('Error tailoring resume with AI:', error)
    throw new Error('Failed to tailor resume')
  }
}

// Placeholder function to simulate AI enhancement
// In a real app, this would be replaced with a call to an AI service
function enhanceResumeForJob(
  latexContent: string,
  jobData: {
    title: string;
    company: string;
    description: string;
    requirements: string[];
  }
): string {
  // This is a simplified simulation of resume enhancement
  // In a real app, you'd call an LLM API like OpenAI
  
  // Extract key terms from job data
  const keyTerms = [
    ...jobData.title.toLowerCase().split(/\s+/),
    ...jobData.description.toLowerCase().split(/\s+/),
    ...jobData.requirements.flatMap(req => req.toLowerCase().split(/\s+/))
  ]
    .filter(term => term.length > 3) // Filter out short words
    .filter(term => !['and', 'the', 'for', 'with'].includes(term)) // Filter common words
  
  // Simple enhancement: Add a targeted objective statement
  let enhanced = latexContent
  
  // Check if there's already a section for objective/summary
  if (!/\\section\{(?:Objective|Summary|Profile)\}/i.test(enhanced)) {
    // Add an objective section after the header
    const headerEndIndex = enhanced.indexOf('\\begin{document}') + '\\begin{document}'.length
    
    const objectiveSection = `
\\section{Professional Summary}
Dedicated professional seeking the ${jobData.title} position at ${jobData.company}, leveraging expertise in ${
      keyTerms.slice(0, 5).join(', ')
    } to deliver exceptional results.
`
    enhanced = enhanced.slice(0, headerEndIndex) + objectiveSection + enhanced.slice(headerEndIndex)
  }
  
  // In a real implementation, the AI would do much more sophisticated modifications
  
  return enhanced
} 