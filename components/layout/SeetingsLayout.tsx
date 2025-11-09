'use client';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/settings/profile" className="text-blue-600">Profile</Link>
          <Link href="/settings/notifications" className="text-blue-600">Notifications</Link>
          <Link href="/settings/org" className="text-blue-600">Organization</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
