"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";

import { resetUserTwoFactorAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/cms/ui";

export function ResetTwoFactorButton({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={buttonClass.secondary}
      onClick={() => {
        if (!confirm(`Turn off two-step verification for ${name}? They will sign in with their password only until they set it up again.`)) return;
        start(async () => {
          await resetUserTwoFactorAction(userId);
          router.refresh();
        });
      }}
    >
      <ShieldOff className="h-4 w-4" /> Reset two-step verification
    </button>
  );
}
