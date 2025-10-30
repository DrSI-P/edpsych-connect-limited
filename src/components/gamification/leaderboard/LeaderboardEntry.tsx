import React from "react";
import { Avatar } from "@mui/material";
import { PointDisplay } from "../common/PointDisplay";

export interface LeaderboardEntryProps {
  rank: number;
  name: string;
  avatarUrl?: string;
  points: number;
  highlight?: boolean;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  rank,
  name,
  avatarUrl,
  points,
  highlight = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-md transition-all ${
        highlight
          ? "bg-purple-50 border-2 border-purple-400 shadow-md"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`font-bold text-lg ${highlight ? "text-purple-600" : "text-gray-700"}`}>
          #{rank}
        </span>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={avatarUrl}
          alt={name}
        >
          {name.charAt(0)}
        </Avatar>
        <span className="font-medium text-gray-800">
          {name}
        </span>
      </div>
      <PointDisplay points={points} size="sm" />
    </div>
  );
};