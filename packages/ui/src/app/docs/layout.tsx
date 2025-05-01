export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="prose-gray p-2">
      {children}
    </main>
  )
}