import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import { promises as fsPromises } from 'fs'

// In a production environment, you would:
// 1. Use a more robust LaTeX to PDF conversion service
// 2. Consider Docker or a managed service for security and isolation
// 3. Implement proper file cleanup and error handling

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
    const { latexContent } = await request.json()
    
    if (!latexContent) {
      return NextResponse.json(
        { message: 'LaTeX content is required' },
        { status: 400 }
      )
    }
    
    // Generate PDF from LaTeX
    const pdfBuffer = await generatePdfFromLatex(latexContent)
    
    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"'
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { message: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

// Function to generate PDF from LaTeX
// Note: In a production environment, you would use a more robust solution
async function generatePdfFromLatex(latexContent: string): Promise<Buffer> {
  // Create a unique temporary directory
  const tempDir = path.join('/tmp', uuidv4())
  const texFilePath = path.join(tempDir, 'resume.tex')
  const pdfFilePath = path.join(tempDir, 'resume.pdf')
  
  try {
    // Create the temp directory
    await fsPromises.mkdir(tempDir, { recursive: true })

    // Write LaTeX content to file
    await fsPromises.writeFile(texFilePath, latexContent)

    // Generate PDF from LaTeX
    const pdfProcess = spawn('pdflatex', [texFilePath])

    // Wait for pdflatex to finish
    await new Promise((resolve, reject) => {
      pdfProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error(`pdflatex exited with code ${code}`))
        }
      })
    })

    // Read generated PDF
    const pdfBuffer = await fsPromises.readFile(pdfFilePath)

    // Cleanup
    await fsPromises.rm(tempDir, { recursive: true })

    return pdfBuffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
} 