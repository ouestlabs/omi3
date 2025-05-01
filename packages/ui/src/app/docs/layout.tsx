export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="px-2 py-20 w-full max-w-max mx-auto">
      {children}
    </main>
  )
}
