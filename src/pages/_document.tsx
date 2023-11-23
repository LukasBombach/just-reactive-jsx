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
      <body className="bg-midnight text-moon grid grid-rows-[4rem_1fr] grid-cols-[1fr_min(65ch,calc(100%_-_64px))_1fr] [&>*]:[grid-area:2/2/2/2] min-[847px]:grid-cols-[6rem_min(65ch,calc(100%_-_64px))_1fr]">
        {children}
      </body>
    </html>
  );
}
