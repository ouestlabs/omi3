export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="px-2 py-10 w-full">
      {children}
    </main>
  )
}