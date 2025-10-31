import { Skeleton } from "@/registry/default/ui/skeleton";

export default function SkeletonOnly() {
  return (
    <div className="flex w-full max-w-92 items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col">
        <Skeleton className="my-0.5 h-4 max-w-54" />
        <div className="flex max-w-54 items-center gap-1">
          <Skeleton className="my-0.5 h-4 w-1/2" />
          <Skeleton className="my-0.5 h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-6 w-17" />
    </div>
  );
}
