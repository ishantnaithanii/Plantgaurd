import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

const cardStyles =
  'relative overflow-hidden rounded-2xl border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_24px_color-mix(in_srgb,var(--brand-950)_8%,transparent),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-green-800 dark:bg-green-950/60 dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)]'

export default function TiltCard({
  as = 'div',
  children,
  className = '',
  maxTilt = 8,
  ...props
}) {
  const MotionCard = motion[as]
  const shouldReduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const highlightOffsetX = useMotionValue(0)
  const highlightOffsetY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 180, damping: 22 })
  const springY = useSpring(pointerY, { stiffness: 180, damping: 22 })
  const highlightX = useSpring(highlightOffsetX, { stiffness: 180, damping: 22 })
  const highlightY = useSpring(highlightOffsetY, { stiffness: 180, damping: 22 })
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt])

  function updatePointer(event) {
    if (shouldReduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    pointerX.set(x / bounds.width)
    pointerY.set(y / bounds.height)
    highlightOffsetX.set(x - bounds.width / 2)
    highlightOffsetY.set(y - bounds.height / 2)
  }

  function resetPointer() {
    pointerX.set(0.5)
    pointerY.set(0.5)
    highlightOffsetX.set(0)
    highlightOffsetY.set(0)
  }

  return (
    <MotionCard
      {...props}
      className={`${cardStyles} group ${className}`.trim()}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformPerspective: 900,
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -5 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        duration: shouldReduceMotion ? 0 : undefined,
      }}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-950)_12%,transparent)_0%,transparent_65%)] opacity-0 group-hover:opacity-100"
          style={{ x: highlightX, y: highlightY }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-20">{children}</div>
    </MotionCard>
  )
}
