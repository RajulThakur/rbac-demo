"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    async function user() {
      const {
        data: { user },
      } = await createClient().auth.getUser();
      if (!user) router.push("/auth/login");
      else router.push("/dashboard");
    }
    user();
  }, [router]);

  return <></>;
}
