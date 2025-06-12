import { Skeleton } from "./ui/skeleton";

export default function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="w-[350px] p-4 rounded-xl bg-muted shadow">
          <Skeleton className="h-6 w-2/3 mb-4" />
          <Skeleton className="h-20 w-full mb-2" />
          <Skeleton className="h-20 w-full mb-2" />
        </div>
      ))}
    </div>
  );
}
