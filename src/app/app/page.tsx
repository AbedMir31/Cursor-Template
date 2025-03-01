import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SuccessToast from '@/components/ui/SuccessToast';

export default async function AppPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // Fetch user's resumes
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  // Fetch user's tailored resumes
  const { data: tailoredResumes } = await supabase
    .from('tailored_resumes')
    .select('*, resumes!inner(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <SuccessToast />
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold">Your Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-8">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md overflow-hidden text-white">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Upload New Resume</h2>
                <p className="mb-4 opacity-90">
                  Add a new LaTeX resume to your collection and start tailoring it for job applications.
                </p>
                <Link 
                  href="/upload" 
                  className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-medium"
                >
                  Upload Resume
                </Link>
              </div>
            </div>
            
            {resumes && resumes.length > 0 && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md overflow-hidden text-white">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">Tailor Your Resume</h2>
                  <p className="mb-4 opacity-90">
                    Select a job posting to optimize your resume for a specific application.
                  </p>
                  <Link 
                    href={`/resumes/${resumes[0].id}`} 
                    className="inline-block px-4 py-2 bg-white text-green-600 rounded-lg font-medium"
                  >
                    Optimize Resume
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Original Resumes */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Your Original Resumes
            </h2>
            
            {!resumes || resumes.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center shadow-sm border">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Upload your first resume to get started with tailoring it for job applications.
                </p>
                <Link 
                  href="/upload"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Upload Resume
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => (
                  <div 
                    key={resume.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                  >
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 truncate">{resume.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/resumes/${resume.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                        >
                          View & Tailor
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Tailored Resumes */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your Tailored Resumes
            </h2>
            
            {!tailoredResumes || tailoredResumes.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center shadow-sm border">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tailored resumes yet</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Select one of your resumes and provide a job link to create a tailored version.
                </p>
                {resumes && resumes.length > 0 && (
                  <Link 
                    href={`/resumes/${resumes[0].id}`}
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                  >
                    Tailor a Resume
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tailoredResumes.map((resume) => (
                  <div 
                    key={resume.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                  >
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 truncate">
                        {resume.job_title} at {resume.company}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Based on: {resume.resumes.title}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Created on {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/resumes/${resume.id}?tailored=true`}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
                        >
                          View Resume
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 