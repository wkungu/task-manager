import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold">Welcome to Task Manager</h1>
      <p className="text-gray-600 mt-2">Manage your tasks efficiently!</p>
      <div className="mt-6 space-x-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Register</Button>
        </Link>
      </div>
    </div>
  );
}
