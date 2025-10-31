import { Cover, CoverFallback, CoverImage } from "@/registry/default/ui/cover";

export default function CoverGroupDemo() {
  return (
    <div className="-space-x-[0.6rem] flex">
      <Cover className="ring-2 ring-background">
        <CoverImage
          alt="U1"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
        />
        <CoverFallback>U1</CoverFallback>
      </Cover>
      <Cover className="ring-2 ring-background">
        <CoverImage
          alt="U2"
          src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=96&h=96&dpr=2&q=80"
        />
        <CoverFallback>U2</CoverFallback>
      </Cover>
      <Cover className="ring-2 ring-background">
        <CoverImage
          alt="U3"
          src="https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=96&h=96&dpr=2&q=80"
        />
        <CoverFallback>U3</CoverFallback>
      </Cover>
    </div>
  );
}
