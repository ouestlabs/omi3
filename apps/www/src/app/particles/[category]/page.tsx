import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/global";
import { getUniqueParticleCategories } from "@/lib/particle-categories";
import { cn } from "@/registry/default/lib/utils";
import { particles } from "@/registry/default/particles";

import { CategoryNavigation } from "../category-navigation";
import { ParticleDisplay } from "../particle-display";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const particleCategories = getUniqueParticleCategories(particles);

function getCategoryDetails(categorySlug: string) {
  const categoryObj = particleCategories.find(
    (cat) => cat.slug === categorySlug
  );

  if (!categoryObj) {
    return { categoryObj: null, categoryParticles: [] };
  }

  const categoryParticles = particles.filter((particle) =>
    particle.category?.includes(categoryObj.name)
  );

  return { categoryObj, categoryParticles };
}

export function generateStaticParams() {
  return particleCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const { categoryObj, categoryParticles } = getCategoryDetails(categorySlug);

  if (!categoryObj) {
    notFound();
  }

  return {
    title: `${
      categoryObj.name.charAt(0).toUpperCase() + categoryObj.name.slice(1)
    } particle components built with React and Tailwind CSS - audio/ui`,
    description: `Showing ${categoryParticles.length} particle component${
      categoryParticles.length !== 1 ? "s" : ""
    } in the ${categoryObj.name} category`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const { categoryObj, categoryParticles } = getCategoryDetails(categorySlug);

  if (!categoryObj) {
    notFound();
  }

  if (categoryParticles.length === 0) {
    notFound();
  }

  return (
    <div className="container w-full">
      <PageHeader>
        <PageHeaderHeading>
          <span className="capitalize">{categoryObj.name}</span> particles
        </PageHeaderHeading>
        <PageHeaderDescription>
          Showing {categoryParticles.length} particle
          {categoryParticles.length !== 1 ? "s" : ""} in the {categoryObj.name}{" "}
          category
        </PageHeaderDescription>
        <CategoryNavigation
          categories={particleCategories}
          currentCategory={categorySlug}
        />
      </PageHeader>
      <div className="grid flex-1 items-stretch gap-3 pb-12 lg:grid-cols-2">
        {categoryParticles.map((particle) => {
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
