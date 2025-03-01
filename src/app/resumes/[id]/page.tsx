import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ResumePreview from '@/components/resume/ResumePreview';
import JobLinkInput from '@/components/resume/JobLinkInput';

export default async function ResumePage({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { tailored?: string } 
}) {
  const supabase = await createClient();
  const isTailored = searchParams.tailored === 'true';
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // Fetch the resume
  let resume;
  let error;
  
  if (isTailored) {
    // Fetch tailored resume
    const response = await supabase
      .from('tailored_resumes')
      .select('*, resumes!inner(*)')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();
    
    resume = response.data;
    error = response.error;
  } else {
    // Fetch original resume
    const response = await supabase
      .from('resumes')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();
    
    resume = response.data;
    error = response.error;
  }

  if (error || !resume) {
    redirect('/dashboard');
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
          <h1 className="text-2xl font-bold">
            {isTailored 
              ? `${resume.job_title} at ${resume.company}` 
              : resume.title}
          </h1>
          {isTailored && (
            <p className="text-gray-600 mt-1">
              Based on: {resume.resumes.title}
            </p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <ResumePreview resume={resume} isTailored={isTailored} />
          </div>
          
          {/* Job Input or Info */}
          <div>
            {isTailored ? (
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-xl font-bold mb-4">Job Details</h2>
                
                {resume.job_url && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Job Posting</h3>
                    <a 
                      href={resume.job_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 hover:underline break-words"
                    >
                      {resume.job_url}
                    </a>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Position</h3>
                  <p className="font-medium">{resume.job_title}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Company</h3>
                  <p className="font-medium">{resume.company}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link 
                    href={`/resumes/${resume.original_resume_id}`}
                    className="text-blue-500 hover:text-blue-600 hover:underline flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    View Original Resume
                  </Link>
                </div>
              </div>
            ) : (
              <JobLinkInput resumeId={resume.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 