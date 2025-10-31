import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";

export default function CoverDemo() {
  return (
    <Cover>
      <CoverImage
        alt="Cover"
        src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
      />
      <CoverFallback>CB</CoverFallback>
    </Cover>
  );
}
