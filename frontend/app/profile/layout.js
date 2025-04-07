import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProfileLayout({ children }) {
    return (
      <div className="flex h-screen">
        <Sidebar />
  
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Navbar title="Profile" />
          {/* Page Content */}
          <main className="p-6 bg-gray-100 dark:bg-gray-500 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
