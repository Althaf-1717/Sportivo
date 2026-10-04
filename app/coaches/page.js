import { redirect } from "next/navigation";

export const metadata = { title: "Coach Portal Sign In" };

export default function CoachesPage() {
  redirect("/login?portal=coach&callbackUrl=/dashboard/coach");
}
