import PageIntro from "@/components/dashboard/PageIntro";
import ProfileForm from "@/components/forms/ProfileForm";

export default function CoachProfilePage() { return <div><PageIntro eyebrow="Your account" title="Coach profile" description="Keep your contact details current so the academy can reach you." /><ProfileForm role="coach" /></div>; }
