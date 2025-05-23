"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { ColoredGrade } from "@/components/colored-grade";
import { SubjectGradeBadge } from "@/components/subject-grade-badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getSortedColumnIcon, truncateText } from "@/lib/utils";
import { AverageWithSubject, Empty } from "@/types/types";
import Link from "next/link";
import { isMobile } from "react-device-detect";
export function columns(
  setSubjectToDelete: Function,
  setOriginalSubject: Function,
  setOpenDelete: Function,
  setOpenEdit: Function,
  translations: any
): ColumnDef<AverageWithSubject>[] {
  return [
    {
      id: "subjectName",
      accessorKey: "subject.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.subject}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        let subject: string = row.original.subject.name || "";
        let isIrrelevant: boolean = row.original.subject.weight === 0;
        let truncated: boolean = truncateText(
          subject,
          isMobile ? 16 : 20
        ).truncated;
        let truncatedSubject: string = truncateText(
          subject,
          isMobile ? 16 : 20
        ).text;

        if (truncated) {
          return (
            <>
              <SubjectGradeBadge
                average={row.original}
                className="mr-1"
                hideText
              />
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "text-left text-wrap break-words max-w-40",
                    isIrrelevant && "text-muted-foreground"
                  )}
                >
                  {truncatedSubject}
                </PopoverTrigger>
                <PopoverContent className="w-fit max-w-80 text-wrap break-words">
                  <p>{subject}</p>
                </PopoverContent>
              </Popover>
            </>
          );
        }
        return (
          <>
            <SubjectGradeBadge
              average={row.original}
              className="mr-1"
              hideText
            />
            <span className={isIrrelevant ? "text-muted-foreground" : ""}>
              {subject}
            </span>
          </>
        );
      },
    },
    {
      id: "grade",
      accessorKey: "average.gradeAverage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {translations.grades.grade}
            {getSortedColumnIcon(column)}
          </Button>
        );
      },
      cell: ({ row }) => {
        let value: number | Empty = row.original.average?.gradeAverage;
        return <ColoredGrade grade={value} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        let average: AverageWithSubject = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {translations.screenreader.openMenu}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {translations.subjects.actions.title}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  className="flex flex-row items-center gap-3"
                  href={`/subject/${average.subject.id}`}
                >
                  <Eye className="size-4 text-muted-foreground" />
                  {translations.subjects.actions.view}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOriginalSubject(average.subject);
                  setOpenEdit(true);
                }}
              >
                <DialogTrigger asChild>
                  <div className="w-full flex flex-row items-center justify-start gap-3">
                    <Edit className="size-4 text-muted-foreground" />
                    <span>{translations.subjects.actions.edit}</span>
                  </div>
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSubjectToDelete(average.subject);
                  setOpenDelete(true);
                }}
              >
                <div className="w-full flex flex-row items-center justify-start gap-3">
                  <Trash className="size-4 text-muted-foreground" />
                  <span>{translations.subjects.actions.delete}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
