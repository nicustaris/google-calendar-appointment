"use server";
import { eventFormSchema } from "@/app/schema/events";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import "use-server";
import { z } from "zod";

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean | undefined }> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  console.log("USER ID", userId);
  if (!success || userId == null) {
    return { error: true };
  }

  await db.insert(EventTable).values({ ...data, clerkUserId: userId });

  redirect("/events");
}
