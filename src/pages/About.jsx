import {
  ArrowRight,
  Cpu,
  HeartHandshake,
  Layers3,
  ShieldCheck,
  Sprout,
  Timer,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const features = [
  {
    title: 'Our Mission',
    description:
      'Help growers spot plant health problems early, so they can care for their crops with confidence.',
    icon: HeartHandshake,
  },
  {
    title: 'Our Technology',
    description:
      'Image recognition analyzes leaf photos to identify signs of common plant diseases.',
    icon: Cpu,
  },
  {
    title: 'Our Impact',
    description:
      'Make useful plant health insights more accessible to gardeners and growers everywhere.',
    icon: Sprout,
  },
]

const stats = [
  { value: '38', label: 'disease classes', icon: Layers3 },
  { value: '92%', label: 'average confidence', icon: Target },
  { value: '3 sec', label: 'per result', icon: Timer },
]

export default function About() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="About PlantGuard"
          subtitle="We’re helping growers make informed plant-care decisions with accessible disease detection."
        />

        <section
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
          aria-label="About PlantGuard"
        >
          {features.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} className="h-full" delay={index * 0.12}>
              <TiltCard as="article" className="h-full p-6 sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-green-950 dark:text-green-100">
                  {title}
                </h2>
                <p className="mt-3 leading-7 text-green-800 dark:text-gray-300">
                  {description}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </section>

        <Reveal className="mt-8">
          <TiltCard
            as="section"
            className="p-3 sm:p-4"
            aria-label="PlantGuard statistics"
          >
            <div className="grid grid-cols-1 divide-y divide-green-200 dark:divide-green-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-4 px-5 py-6 text-left sm:py-7"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300 sm:text-4xl">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-green-800 dark:text-gray-300">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </Reveal>

        <Reveal className="mt-8">
          <section className="relative overflow-hidden rounded-2xl border border-green-200/80 bg-gradient-to-r from-green-50 to-white p-6 dark:border-green-900 dark:from-green-950 dark:to-gray-950 sm:flex sm:items-center sm:gap-6 sm:p-8">
            <span
              className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 sm:mb-0"
              aria-hidden="true"
            >
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.14em] text-green-700 uppercase dark:text-green-300">
                Helpful, with care
              </p>
              <h2 className="mt-1 text-xl font-semibold text-green-950 dark:text-green-100">
                A useful first look, not a final diagnosis.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-green-800 dark:text-gray-300">
                PlantGuard predictions are a starting point. Since different
                plant issues can look alike, confirm what you see with a trusted
                plant-health professional before deciding on treatment.
              </p>
            </div>
            <Link
              to="/how-it-works"
              className="mt-5 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-green-300 dark:hover:text-green-200 sm:mt-0"
            >
              How it works
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </Reveal>
      </div>
    </main>
  )
}
