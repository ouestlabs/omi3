import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";

export default function CoverRadiusDemo() {
  return (
    <div className="flex items-center gap-4">
      <Cover className="rounded-md">
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
      <Cover className="rounded-xl">
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
      <Cover className="rounded-full">
        <CoverImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <CoverFallback>AV</CoverFallback>
      </Cover>
    </div>
  );
}
