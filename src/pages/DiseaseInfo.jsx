import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import diseases from '../data/diseases'

export default function DiseaseInfo() {
  const [query, setQuery] = useState('')

  const filteredDiseases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return diseases

    return diseases.filter((disease) =>
      [
        disease.name,
        disease.scientificName,
        ...disease.symptoms,
        ...disease.prevention,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
  }, [query])

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Plant Disease Info"
          subtitle="Explore common leaf diseases, recognize their symptoms, and learn ways to help prevent them."
        />

        <div className="mx-auto mb-8 max-w-xl">
          <label
            htmlFor="disease-search"
            className="mb-2 block text-sm font-medium text-green-950 dark:text-green-100"
          >
            Search diseases
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-green-800 dark:text-gray-400"
              aria-hidden="true"
            />
            <input
              id="disease-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, symptoms, or prevention"
              className="w-full rounded-xl border border-green-300 bg-white py-3 pr-4 pl-12 text-green-950 shadow-sm outline-none transition-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-green-700 dark:bg-green-950 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        {filteredDiseases.length > 0 ? (
          <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            aria-label="Plant diseases"
          >
            {filteredDiseases.map((disease, index) => (
              <Reveal
                key={disease.name}
                className="h-full"
                delay={index * 0.12}
              >
                <TiltCard as="article" className="h-full p-6 sm:p-7">
                  <h2 className="text-xl font-semibold text-green-950 dark:text-green-100">
                    {disease.name}
                  </h2>
                  <p className="mt-1 text-sm italic text-green-800 dark:text-gray-300">
                    {disease.scientificName}
                  </p>

                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Symptoms
                    </h3>
                    <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm leading-6 text-green-800 marker:text-green-700 dark:text-gray-300 dark:marker:text-green-400">
                      {disease.symptoms.map((symptom) => (
                        <li key={symptom}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Prevention
                    </h3>
                    <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm leading-6 text-green-800 marker:text-green-700 dark:text-gray-300 dark:marker:text-green-400">
                      {disease.prevention.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </section>
        ) : (
          <p
            className="rounded-xl border border-green-200 bg-white px-5 py-8 text-center text-green-800 dark:border-green-800 dark:bg-green-950/60 dark:text-gray-300"
            role="status"
          >
            No diseases match “{query}”. Try a different search.
          </p>
        )}
      </div>
    </main>
  )
}
