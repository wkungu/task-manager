"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemeToggle from '@/components/ThemeToggle';


export default function SettingsPage() {
  
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);


  return (
    <>
      <div className="flex justify-between items-center">
            <h6 className="font-bold">App Settings</h6>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex w-md items-center">
              <ThemeToggle />
              <span className="flex pl-5 align-center text-sm">Toggle Theme</span>
            </div>
          </div>
    </>
  );
}
