// ─── StarRating ───────────────────────────────────────────────────────────────
// Reusable star display component. Renders 5 SVG stars (filled / half / empty).
// Pure presentational — no "use client" needed.

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const SIZES = {
  sm: 14,
  md: 18,
  lg: 24,
} as const;

function StarIcon({
  fill,
  size,
  index,
}: {
  fill: "full" | "half" | "empty";
  size: number;
  index: number;
}) {
  const id = `star-half-${size}-${index}`;

  if (fill === "half") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#${id})`}
          stroke="#FBBF24"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill === "full" ? "#FBBF24" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="#FBBF24"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const px = SIZES[size];
  const stars: Array<"full" | "half" | "empty"> = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push("full");
    } else if (rating >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {stars.map((fill, idx) => (
        <StarIcon key={idx} fill={fill} size={px} index={idx} />
      ))}
      {showValue && (
        <span
          className={cn(
            "ml-1 font-medium text-gray-700",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
