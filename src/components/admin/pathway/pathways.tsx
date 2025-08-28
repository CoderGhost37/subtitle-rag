import { Suspense } from "react";
import { getPathways } from "@/actions/admin/get-pathways";
import { Skeleton } from "@/components/ui/skeleton";
import { Pathway } from "./pathway";

export async function Pathways() {
  const pathways = await getPathways();

  return (
    <Suspense fallback={<PathwaysLoading />}>
      {pathways.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground">No pathways found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pathways.map((pathway) => (
            <Pathway key={pathway.id} pathway={pathway} />
          ))}
        </div>
      )}
    </Suspense>
  );
}

function PathwaysLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
