export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-500">Series OS</h1>
          <p className="text-gray-500 mt-1 text-sm">The operating system for founders</p>
        </div>
        {children}
      </div>
    </div>
  );
}
