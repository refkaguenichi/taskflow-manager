"use client";
import Link from "next/link";
import { Home, FolderKanban, Bell, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="font-bold text-lg mb-6">TaskFlow</div>
      <nav className="flex flex-col gap-3 text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <Home size={16} /> Dashboard
        </Link>
        <Link
          href="/projects"
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <FolderKanban size={16} /> Projects
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <Bell size={16} /> Notifications
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 hover:text-blue-600 mt-auto"
        >
          <Settings size={16} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
