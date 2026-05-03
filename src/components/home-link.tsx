"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";

type HomeLinkProps = {
  children: ReactNode;
  className?: string;
};

export function HomeLink({ children, className }: HomeLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign("/");
  };

  return (
    <Link className={className} href="/" onClick={handleClick} prefetch={false}>
      {children}
    </Link>
  );
}
