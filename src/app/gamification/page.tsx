'use client';
import React from 'react';
import { LeaderboardEntry } from '@/components/gamification/leaderboard/LeaderboardEntry';

export default function GamificationPage() {
  const sampleLeaderboard = [
    { rank: 1, name: 'Alice', points: 1200 },
    { rank: 2, name: 'Bob', points: 950 },
    { rank: 3, name: 'Charlie', points: 870 },
  ];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Gamification Leaderboard</h1>
      {sampleLeaderboard.map((entry) => (
        <LeaderboardEntry
          key={entry.rank}
          rank={entry.rank}
          name={entry.name}
          points={entry.points}
        />
      ))}
    </main>
  );
}