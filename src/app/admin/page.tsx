import { BookOpen, FileText, TrendingUp, Upload, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getStats } from "@/actions/admin/get-stats";
import { StatCard } from "@/components/admin/stat-card";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of your RAG chatbot system",
};

export default function AdminPage() {
  return (
    <main>
      <div className="space-y-6">
        <div>
          <p className="text-3xl font-bold">Admin Dashboard</p>
          <p className="text-muted-foreground">
            Overview of your RAG chatbot system
          </p>
        </div>

        <Stats />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Manage Pathways
              </CardTitle>
              <CardDescription>
                View and manage learning pathways and their documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/pathways"
                className={buttonVariants({
                  variant: "default",
                  className: "w-full",
                })}
              >
                View Pathways
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Add new SRT/BTT files to expand the knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/upload"
                className={buttonVariants({ className: "w-full" })}
              >
                Upload Files
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Document Library
              </CardTitle>
              <CardDescription>
                Browse and manage all uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/upload"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                View Library
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

async function Stats() {
  const stats = await getStats();
  if (!stats) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Pathways"
          value={stats.totalPathways}
          description="Learning pathways available"
          Icon={BookOpen}
        />
        <StatCard
          title="Total Documents"
          value={stats.totalDocuments}
          description="Knowledge base documents"
          Icon={FileText}
        />
        <StatCard
          title="Chat Sessions"
          value={0}
          description="Student interactions"
          Icon={Users}
        />
        <StatCard
          title="System Status"
          value="Online"
          description="All systems operational"
          Icon={TrendingUp}
        />
      </div>
    </Suspense>
  );
}
