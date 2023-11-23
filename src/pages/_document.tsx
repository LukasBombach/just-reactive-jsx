import type { ReactNode } from "react";

interface Props {
  criticalCss?: string;
  children?: ReactNode;
}

export function Document({ criticalCss, children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Unfinished Thought</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {criticalCss && <style>{criticalCss}</style>}
      </head>
      <body className="bg-midnight text-moon">{children}</body>
    </html>
  );
}
