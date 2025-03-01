import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            TailorMade Resume Enhancement
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get past ATS systems and land more interviews by optimizing your 
            resume for each job application with our AI-powered platform.
          </p>
          <Link 
            href="/auth"
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Upload your LaTeX resume to get started.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Paste Job Link</h3>
              <p className="text-gray-600">Add a link to the job posting you want to apply for.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
              <p className="text-gray-600">Our AI tailors your resume for the specific job requirements.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-xl font-bold mb-2">Download & Apply</h3>
              <p className="text-gray-600">Get your optimized PDF resume ready for submission.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ATS Optimized</h3>
              <p className="text-gray-600">Get past automatic resume screening systems with tailored keywords.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Save Time</h3>
              <p className="text-gray-600">No more manual editing for each application. Tailor your resume in seconds.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Format</h3>
              <p className="text-gray-600">Maintain a polished, professional LaTeX resume format.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Upgrade Your Job Search?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join TailorMade today and start optimizing your resume for every job application.
          </p>
          <Link 
            href="/auth"
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
