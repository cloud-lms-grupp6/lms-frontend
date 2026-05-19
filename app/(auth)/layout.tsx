import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex h-[calc(100vh-2rem)] max-h-[960px] w-full max-w-[1600px] overflow-hidden rounded-card bg-card shadow-sm">
        <aside className="relative hidden w-1/2 overflow-hidden bg-sidebar lg:block">

          <Image
            src="/auth-bg.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-tab-active/70" aria-hidden />
          <div className="absolute left-8 top-8 z-10 flex items-center gap-2 text-sidebar-foreground">
            <Image src="/shiko-logo-white.svg" alt="Shiko" width={130} height={50} />
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}
