import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";

export default function CoverSizeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Cover>
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
      <Cover className="size-12">
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=144&h=144&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
      <Cover className="size-16">
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=192&h=192&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
    </div>
  );
}
