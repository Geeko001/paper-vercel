import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-20 text-center sm:px-6">
      <p className="meta-label">404</p>
      <h1 className="font-display mt-2 text-[36px] tracking-tight">Piece not found</h1>
      <p className="mt-2 text-[14px] text-foreground-muted">
        Try changing your search or filters.
      </p>
      <Link href="/research" className="mt-6 inline-block underline underline-offset-4 text-[14px]">
        Back to writing
      </Link>
    </div>
  );
}
