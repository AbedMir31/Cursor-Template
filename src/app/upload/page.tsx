import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ResumeUploader from '@/components/resume/ResumeUploader';

export default async function UploadPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/dashboard" 
            className="text-blue-500 hover:text-blue-600 flex items-center text-sm mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Upload Your Resume</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ResumeUploader />
          </div>
          
          <div>
            <div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-4 text-lg">Tips for LaTeX Resumes</h3>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Make sure your LaTeX file compiles correctly before uploading
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Include all necessary packages in your preamble
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Use standard LaTeX resume templates for best results
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Structure your resume with clear sections (Education, Experience, Skills, etc.)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 