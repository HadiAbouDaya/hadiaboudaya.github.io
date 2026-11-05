import type { ComponentProps } from "react";

/** Keyboard users need to focus overflowing code before scrolling it with arrow keys. */
export function ArticleCodeBlock(props: ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      tabIndex={0}
      role="region"
      aria-label="Code example"
      className={`max-w-full overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${props.className ?? ""}`}
    />
  );
}
