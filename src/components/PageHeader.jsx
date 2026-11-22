export default function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-green-800 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </header>
  )
}
