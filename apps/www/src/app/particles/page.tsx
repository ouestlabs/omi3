import type { Metadata } from "next";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/global";
import { getUniqueParticleCategories } from "@/lib/particle-categories";
import { cn } from "@/registry/default/lib/utils";
import { particles } from "@/registry/default/particles";

import { CategoryNavigation } from "./category-navigation";
import { ParticleDisplay } from "./particle-display";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

const particleCategories = getUniqueParticleCategories(particles);

const title = "Particles";
const description =
  "Particles are more than just components. They are the building blocks of your design system. Click on a category or browse them all.";

export const metadata: Metadata = {
  title: "Particle components built with React and Tailwind CSS - audio/ui",
  description,
};

export default function Page() {
  return (
    <div className="container w-full">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription className="max-w-2xl">
          {description}
        </PageHeaderDescription>
        <CategoryNavigation categories={particleCategories} />
      </PageHeader>
      <div className="grid flex-1 items-stretch gap-9 pb-12 lg:grid-cols-2 lg:gap-6 xl:gap-9">
        {particles.map((particle) => {
          const ParticleComponent = particle.component;
          return (
            <ParticleDisplay
              className={cn(
                particle.fullWidth ? "lg:col-span-2" : "lg:col-span-1",
                particle.className
              )}
              key={particle.id}
              name={particle.id}
            >
              <ParticleComponent />
            </ParticleDisplay>
          );
        })}
      </div>
    </div>
  );
}
