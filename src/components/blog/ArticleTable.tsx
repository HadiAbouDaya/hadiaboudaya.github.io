import type { ComponentProps } from "react";

export function ArticleTable(props: ComponentProps<"table">) {
  return (
    <div role="region" aria-label="Article comparison table" tabIndex={0}
      className="my-6 max-w-full overflow-x-auto rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
      <table {...props} className={`my-0 min-w-[32rem] ${props.className ?? ""}`} />
    </div>
  );
}
