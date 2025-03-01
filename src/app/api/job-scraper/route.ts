import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Simple type for job data
type ScrapedJobData = {
  title: string
  company: string
  location?: string
  description: string
  requirements: string[]
}

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
    const { jobUrl } = await request.json()
    
    if (!jobUrl) {
      return NextResponse.json(
        { message: 'Job URL is required' },
        { status: 400 }
      )
    }
    
    // Validate URL
    try {
      new URL(jobUrl)
    } catch {
      return NextResponse.json(
        { message: 'Invalid URL format' },
        { status: 400 }
      )
    }
    
    // Scrape job data
    const jobData = await scrapeJobData(jobUrl)
    
    // Return the scraped data
    return NextResponse.json(jobData)
  } catch (error) {
    console.error('Error in job-scraper:', error)
    return NextResponse.json(
      { message: 'Failed to scrape job data' },
      { status: 500 }
    )
  }
}

// Function to scrape job data from URLs
async function scrapeJobData(url: string): Promise<ScrapedJobData> {
  // This is a simplified implementation
  // In a real app, you'd need to handle different job sites and parse HTML properly
  
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch job posting: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Extract job data (simplified implementation)
    // In a real application, you'd use a proper HTML parser and handle different job posting formats
    
    const title = extractJobTitle(html) || 'Unknown Position'
    const company = extractCompany(html) || 'Unknown Company'
    const description = extractDescription(html) || ''
    const requirements = extractRequirements(html) || []
    
    return {
      title,
      company,
      description,
      requirements
    }
  } catch (error) {
    console.error('Error scraping job data:', error)
    throw new Error('Failed to scrape job data')
  }
}

// These are placeholder functions - in a real app you would implement proper HTML parsing
function extractJobTitle(html: string): string | null {
  // Simplified extraction logic
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                    html.match(/title">([^<]+)<\//) ||
                    html.match(/job-title">([^<]+)<\//)
  return titleMatch ? titleMatch[1].trim() : null
}

function extractCompany(html: string): string | null {
  // Simplified extraction logic
  const companyMatch = html.match(/company">([^<]+)<\//) || 
                      html.match(/organization">([^<]+)<\//)
  return companyMatch ? companyMatch[1].trim() : null
}

function extractDescription(html: string): string | null {
  // Simplified extraction logic
  const descriptionMatch = html.match(/description"[^>]*>([\s\S]*?)<\/div>/) ||
                          html.match(/job-description"[^>]*>([\s\S]*?)<\/div>/)
  
  if (!descriptionMatch) return null
  
  // Strip HTML tags
  const description = descriptionMatch[1].replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return description
}

function extractRequirements(html: string): string[] | null {
  // Look for list items in the description/requirements section
  const requirementMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/g)
  
  if (!requirementMatches) return []
  
  // Process each list item
  return requirementMatches.map(item => {
    // Strip HTML tags
    return item.replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }).filter(Boolean)
} 