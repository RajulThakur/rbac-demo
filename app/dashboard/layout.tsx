"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import ToastError from "@/components/toast-error";
import { Session, User } from "@supabase/supabase-js";
import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        ToastError(error.message);
      } else {
        router.push("/auth");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      ToastError(error.message);
    }
  };
  useEffect(() => {
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/auth");
      }
      setLoading(false);
    });

    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (!session?.user) {
          router.push("/auth");
        }
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [router]);
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <header className='border-b flex w-dvw bg-card'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Shield className='h-6 w-6 text-primary' />
            <h1 className='text-xl font-bold'>RBAC Configuration Tool</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-muted-foreground'>
              Welcome, {user.email}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSignOut}>
              <LogOut className='h-4 w-4 mr-2' />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <div className='flex-1 w-full flex flex-col gap-2 items-center'>
        {children}
      </div>
    </main>
  );
}
