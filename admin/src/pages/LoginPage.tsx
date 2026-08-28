import PageHeader from "../components/PageHeader.tsx";
import LoginForm from "../components/LoginForm.tsx";
import { useAuthStore } from "../store/authStore.ts";

function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const loginError = useAuthStore((s) => s.loginError);
  const isLoggingIn = useAuthStore((s) => s.isLoggingIn);

  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" />
      <main>
        <LoginForm
          onSubmit={login}
          errorMessage={loginError}
          isSubmitting={isLoggingIn}
        />
      </main>
    </div>
  );
}

export default LoginPage;
