import Image from "next/image";
import { usePathwayStore } from "@/hooks/use-pathway";
import { getPathwayIcon } from "@/utils/getPathwayIcon";
import { ModeToggle } from "../theme/theme-toggle";

export function ChatHeader() {
  const { pathwayName } = usePathwayStore();
  if (!pathwayName) return null;
  return (
    <div className="bg-card border-b shadow-sm pl-4">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={getPathwayIcon(pathwayName)}
              alt={pathwayName}
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold">{pathwayName} Assistant</p>
              <p className="text-sm text-muted-foreground">
                Ask me anything about {pathwayName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
