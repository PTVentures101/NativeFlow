import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf8f5] dark:bg-[#09090b]">
      <SignUp />
    </div>
  );
}
