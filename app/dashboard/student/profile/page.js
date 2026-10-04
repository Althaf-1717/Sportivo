import PageIntro from "@/components/dashboard/PageIntro";
import ProfileForm from "@/components/forms/ProfileForm";

export default function StudentProfilePage() { return <div><PageIntro eyebrow="Your details" title="Your profile" description="Keep your contact information up to date for the academy and your coach." /><ProfileForm role="student" /></div>; }
