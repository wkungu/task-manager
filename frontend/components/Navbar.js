"use client";

import ThemeToggle from '@/components/ThemeToggle';
import { useSession, signOut } from "next-auth/react";

const Navbar = ({title}) => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">{title ? title : 'Dashboard'}</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 dark:text-white">{session?.user?.email}</span>
        <ThemeToggle />
        <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
