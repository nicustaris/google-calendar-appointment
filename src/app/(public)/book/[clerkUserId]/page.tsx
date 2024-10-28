import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/drizzle/db';
import { formatEventDescription } from '@/lib/formatters';
import { clerkClient } from '@clerk/nextjs/server';
import { sql } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BookingPage({
  params: { clerkUserId },
}: {
  params: { clerkUserId: string };
}) {
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { and, eq }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc }) => asc(sql`lower(${name})`),
  });

  if (events.length === 0) return notFound();

  const { fullName } = await clerkClient().users.getUser(clerkUserId);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-4xl md:text-5xl font-semibold mb-4 text-center">
        {fullName}
      </div>
      <div className="text-muted-foreground mb-6 max-w-sm text-center mx-auto">
        Welcome to my scheduling page. Please follow instructions to add an
        event to my calendar.
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

type EventCardProps = {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
};

function EventCard({
  id,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) {
  return (
    <Card className={'flex flex-col border-secondary/50'}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description != null && <CardContent>{description}</CardContent>}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild>
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
