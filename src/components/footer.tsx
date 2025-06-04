export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold">Your Brand Name</h2>
            <p className="text-sm">© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-sm hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}