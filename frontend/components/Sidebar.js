"use client";

import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-500 dark:bg-gray-800 text-white h-screen p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Task Manager</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
              📋 Tasks
            </Link>
          </li>
          <li>
            <Link href="/profile" className="block p-2 rounded hover:bg-gray-700">
              👤 Profile
            </Link>
          </li>
          <li>
            <Link href="/settings" className="block p-2 rounded hover:bg-gray-700">
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
