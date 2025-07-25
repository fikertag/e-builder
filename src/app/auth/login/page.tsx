import { LoginForm } from "@/components/login-form-main";

export default function Page() {
  return (
    <div className="flex  w-full items-center min-h-screen justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
