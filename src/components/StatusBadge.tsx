"use client";

import Chip from "@mui/material/Chip";

type Status = "reserve" | "in_progress" | "completed";

const statusMap: Record<
  Status,
  { label: string; color: string; borderColor: string }
> = {
  reserve: { label: "Reserved", color: "#854D0E", borderColor: "#EAB308" },
  in_progress: {
    label: "In Progress",
    color: "#0F766E",
    borderColor: "#14B8A6",
  },
  completed: { label: "Completed", color: "#475569", borderColor: "#94A3B8" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status as Status] ?? {
    label: status,
    color: "#475569",
    borderColor: "#CBD5E1",
  };

  return (
    <Chip
      label={s.label}
      size="small"
      variant="outlined"
      sx={{
        color: s.color,
        borderColor: s.borderColor,
        fontWeight: 700,
        fontSize: "0.7rem",
        height: "22px",
        borderRadius: "6px",
      }}
    />
  );
}
