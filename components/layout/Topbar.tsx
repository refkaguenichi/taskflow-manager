"use client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const { user, signOut } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <h1 className="font-semibold text-lg">Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut size={14} className="mr-1" /> Logout
        </Button>
      </div>
    </header>
  );
}
