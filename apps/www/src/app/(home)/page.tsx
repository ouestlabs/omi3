import { DemoGrid } from "@/app/(home)/elements/demo-grid";
import { Hero } from "@/app/(home)/elements/hero";
import { ThemeCustomizer } from "@/components/theme/customizer";

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <div className="container-wrapper" id="themes">
        <div className="container flex items-center justify-between gap-8 p-5 pt-8 sm:p-8">
          <ThemeCustomizer />
        </div>
      </div>
      <div className="container-wrapper flex flex-1 flex-col pb-6">
        <div className="theme-container container flex flex-1 flex-col">
          <DemoGrid />
        </div>
      </div>
    </div>
  );
}
