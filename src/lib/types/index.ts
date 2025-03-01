export type Resume = {
  id: string
  user_id: string
  title: string
  latex_content: string
  created_at: string
  updated_at: string
}

export type TailoredResume = {
  id: string
  original_resume_id: string
  job_url: string
  job_title: string
  company: string
  latex_content: string
  created_at: string
}

export type JobDetails = {
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  skills: string[]
  keywords: string[]
} 