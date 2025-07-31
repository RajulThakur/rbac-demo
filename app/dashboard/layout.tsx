import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <div className='flex-1 w-full flex flex-col gap-20 items-center'>
        <nav className='w-full flex justify-between items-center border-b border-b-foreground/10 h-16'>
        <h1>Rbac</h1>
          <div className="flex gap-2">
            <ThemeSwitcher />
            <CurrentUserAvatar />
          </div>
        </nav>
        <div className='flex-1 flex flex-col gap-20 max-w-5xl p-5'>
          {children}
        </div>
      </div>
    </main>
  );
}
