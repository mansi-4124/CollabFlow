import { Link } from "react-router-dom"; // If using React Router. Use <a> for plain href.
import { Button } from "./ui/button";

export default function LandingHeader() {
  return (
    <header className="w-full border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f0e47]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-semibold tracking-wide text-[#0F0E47] dark:text-white">
          CollabFlow
        </div>

        {/* Navigation - Login */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="uppercase tracking-wide text-sm font-medium px-6 py-2 border-black dark:border-white border hover:bg-[#272757] dark:hover:bg-[#272757] rounded-none"
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
