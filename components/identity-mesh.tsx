"use client";

type Node = { id: string; x: number; y: number; r: number };
type Edge = { from: string; to: string; delay: number };

const nodes: Node[] = [
  { id: "core", x: 300, y: 360, r: 7 },
  { id: "a", x: 150, y: 220, r: 4 },
  { id: "b", x: 300, y: 140, r: 5 },
  { id: "c", x: 460, y: 210, r: 4 },
  { id: "d", x: 500, y: 380, r: 4 },
  { id: "e", x: 420, y: 520, r: 4 },
  { id: "f", x: 240, y: 560, r: 4 },
  { id: "g", x: 100, y: 460, r: 4 },
  { id: "h", x: 90, y: 320, r: 3 },
  { id: "i", x: 340, y: 260, r: 3 },
  { id: "j", x: 220, y: 400, r: 3 },
];

const edges: Edge[] = [
  { from: "core", to: "a", delay: 0 },
  { from: "core", to: "b", delay: 0.3 },
  { from: "core", to: "c", delay: 0.6 },
  { from: "core", to: "d", delay: 0.9 },
  { from: "core", to: "e", delay: 1.2 },
  { from: "core", to: "f", delay: 1.5 },
  { from: "core", to: "g", delay: 1.8 },
  { from: "a", to: "h", delay: 0.4 },
  { from: "a", to: "b", delay: 0.7 },
  { from: "b", to: "c", delay: 1.0 },
  { from: "c", to: "d", delay: 1.3 },
  { from: "d", to: "e", delay: 1.6 },
  { from: "e", to: "f", delay: 1.9 },
  { from: "f", to: "g", delay: 2.2 },
  { from: "g", to: "h", delay: 2.5 },
  { from: "h", to: "j", delay: 0.5 },
  { from: "j", to: "core", delay: 0.8 },
  { from: "i", to: "core", delay: 1.1 },
  { from: "i", to: "b", delay: 1.4 },
  { from: "i", to: "c", delay: 1.7 },
];

function pt(id: string) {
  const n = nodes.find((n) => n.id === id)!;
  return n;
}

export function IdentityMesh({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 640"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {edges.map((e, idx) => {
        const a = pt(e.from);
        const b = pt(e.to);
        return (
          <line
            key={idx}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.22"
            strokeWidth="1"
            className="animate-pulse-line"
            style={{ animationDelay: `${e.delay}s` }}
          />
        );
      })}
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.id === "core" ? "hsl(var(--accent))" : "hsl(var(--foreground))"}
          fillOpacity={n.id === "core" ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}