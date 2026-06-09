// Progress bubbles: the signature element of the app.
// Each bubble represents `bubbleValue` units (doors = 5/bubble, etc.).
// Bubbles fill solid green as units stack; the in-progress bubble
// partially fills; bubbles past the target glow purple (overdrive).
export default function ProgressBubbles({ count, target, bubbleValue }) {
  const totalBubbles = Math.ceil(target / bubbleValue);
  // Extra bubbles appear once the rep blows past target — no cap on hustle
  const overflowBubbles = Math.max(0, Math.ceil((count - target) / bubbleValue));
  const bubbles = totalBubbles + overflowBubbles;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3" aria-hidden="true">
      {Array.from({ length: bubbles }, (_, i) => {
        const bubbleStart = i * bubbleValue;
        const filledUnits = Math.min(bubbleValue, Math.max(0, count - bubbleStart));
        const fillPct = (filledUnits / bubbleValue) * 100;
        const isOverdrive = bubbleStart >= target;
        const isFull = filledUnits >= bubbleValue;

        return (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border overflow-hidden relative
              ${isFull ? 'animate-pop' : ''}
              ${isOverdrive ? 'border-imperial-purpleglow' : 'border-imperial-line'}`}
            style={{ background: '#2B2738' }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-200"
              style={{
                height: `${fillPct}%`,
                background: isOverdrive ? '#A78BFA' : '#22C55E',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
