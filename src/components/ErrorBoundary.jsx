import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('The application encountered an unexpected error.', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <section
            className="w-full max-w-lg rounded-2xl border border-green-200 bg-white/60 p-8 text-center shadow-lg shadow-green-950/10 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60"
            role="alert"
          >
            <h1 className="text-2xl font-bold text-green-950 dark:text-green-100">
              Something went wrong
            </h1>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-950)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:bg-green-700"
            >
              Reload page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
