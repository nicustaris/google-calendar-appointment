import { ReactNode } from 'react';
import { CalendarRange } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { NavLink } from '@/components/NavLink';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex py-2 border-b bg-card">
        <nav className="flex items-center text-sm font-medium gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <CalendarRange size={30} />
            <span className="sr-only md:not-sr-only">Calendar</span>
          </div>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/schedule">Schedule</NavLink>
          <div className="ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: 'size-full' } }}
            />
          </div>
        </nav>
      </header>

      <main className="container my-6">{children}</main>
    </>
  );
}
