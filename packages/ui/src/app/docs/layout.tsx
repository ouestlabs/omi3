export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="p-2 md:p-10 w-full max-w-max mx-auto">
      <article className="prose prose-neutral dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none">
        {children}
      </article>
    </main>
  )
}
