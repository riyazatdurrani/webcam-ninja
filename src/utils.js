// Helper for random int in [min, max]
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper for random color
export function randomColor() {
  const colors = ['#ff5252', '#ffb300', '#4caf50', '#2196f3', '#e040fb', '#ffeb3b'];
  return colors[randInt(0, colors.length - 1)];
}

// Check if a line (slice) intersects a circle (object)
export function lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
  // Closest point on line segment to circle center
  const dx = x2 - x1;
  const dy = y2 - y1;
  const fx = x1 - cx;
  const fy = y1 - cy;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = (fx * fx + fy * fy) - r * r;
  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return false;
  discriminant = Math.sqrt(discriminant);
  const t1 = (-b - discriminant) / (2 * a);
  const t2 = (-b + discriminant) / (2 * a);
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}
