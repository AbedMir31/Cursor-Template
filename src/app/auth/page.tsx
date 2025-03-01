import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">TailorMade</h1>
        <p className="text-gray-600">Sign in to optimize your resume</p>
      </div>
      
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
      
      <div className="mt-12 max-w-md text-center">
        <h2 className="font-semibold text-gray-700 mb-2">Why use TailorMade?</h2>
        <ul className="text-gray-600 space-y-1 text-sm">
          <li>✓ Enhance your resume for specific job applications</li>
          <li>✓ Get past ATS systems with optimized keywords</li>
          <li>✓ Maintain professional LaTeX formatting</li>
          <li>✓ Save multiple versions for different applications</li>
        </ul>
      </div>
    </div>
  );
} 