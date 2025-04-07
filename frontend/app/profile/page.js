"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser, updateUser, updateUserPassword } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCurrentUser()
        .then((data) => {
          setUser(data);
          setValue("username", data.username);
          setValue("email", data.email);
        })
        .catch((err) => console.error("Error fetching user", err))
        .finally(() => setLoading(false));
    }
  }, [status, router, setValue]);

  const handleProfileUpdate = async (data) => {
    try {
      const updated = await updateUser({ id: user.id, ...data });
      setUser(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await updateUserPassword({ id: user.id, ...passwordData });
      setPasswordData({ current_password: "", new_password: "" });
      toast.success("Password updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    }
  };

  if (loading) return <div className="flex items-center flex-col"><Spinner /><span>Loading...</span></div>;
  if (!user) return null;

  return (
    <>
      <div className="flex justify-between items-center">
        <h6 className="font-bold">My Profile</h6>
      </div>

      <section className="flex mt-10">

        <div className="w-full mb-6 mr-5 space-y-4">
          <form onSubmit={handleSubmit(handleProfileUpdate)}>
            <Input
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className="mb-5"
            />
            {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
            
            <Input
              placeholder="Email"
              type="email"
              className="mb-5"
              {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
            
            <Button type="submit">Update Profile</Button>
          </form>
        </div>

        <div className="w-full ml-5 space-y-4">
          <Input
            placeholder="Current Password"
            type="password"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
          />
          
          <Input
            placeholder="New Password"
            type="password"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
          />
          
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </div>

      </section>

      {/* Toast Container */}
      <div>
        <ToastContainer />
      </div>
    </>
  );
}
