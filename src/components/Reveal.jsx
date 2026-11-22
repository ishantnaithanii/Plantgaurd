import { motion, useReducedMotion } from 'framer-motion'

export default function Reveal({
  as = 'div',
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  trigger = 'view',
  ...props
}) {
  const MotionElement = motion[as]
  const shouldReduceMotion = useReducedMotion()
  const animationProps =
    shouldReduceMotion || trigger === 'load'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: { once: true, amount: 0.15 } }

  return (
    <MotionElement
      {...props}
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      {...animationProps}
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
          scale: 0.97,
          rotateX: 10,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      style={{ transformPerspective: 900, transformOrigin: 'center bottom' }}
    >
      {children}
    </MotionElement>
  )
}
