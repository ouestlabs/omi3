import { CopyButton } from "@/components/ui/copy-button";
import { getIconForLanguageExtension } from "@/lib/get-icon";
import { highlightCode } from "@/lib/highlight-code";

async function CodeBlock({
  code,
  language,
  title,
  copyButton = true,
  showLineNumbers = true,
}: {
  code: string;
  language: string;
  title?: string | undefined;
  copyButton?: boolean;
  showLineNumbers?: boolean;
}) {
  const highlightedCode = await highlightCode(code, language, {
    showLineNumbers,
  });

  return (
    <figure data-rehype-pretty-code-figure="">
      {title && (
        <figcaption
          className="flex items-center gap-2 text-code-foreground [&_svg]:size-5 [&_svg]:text-code-foreground sm:[&_svg]:size-4"
          data-language={language}
          data-rehype-pretty-code-title=""
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      {copyButton && <CopyButton value={code} />}
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: shiki needs this */}
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  );
}
export { CodeBlock };
