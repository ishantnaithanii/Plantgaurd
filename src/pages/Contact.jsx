import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const contactDetails = [
  { title: 'Email', value: 'hello@plantguard.example', icon: Mail },
  { title: 'Phone', value: '+1 (555) 010-0142', icon: Phone },
  { title: 'Address', value: 'Serving growers everywhere', icon: MapPin },
]

const initialForm = { name: '', email: '', message: '' }

function validateForm(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.message.trim()) errors.message = 'Please enter a message.'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateForm(form)
    setErrors(validationErrors)
    setSubmitted(false)

    if (Object.keys(validationErrors).length > 0) return

    const contactData = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }
    console.log('Contact form submission:', contactData)
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Contact Us"
          subtitle="Have a question or feedback? Send us a message and we’ll be glad to hear from you."
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <TiltCard as="section" className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-green-950 dark:text-green-100">
                Send us a message
              </h2>
              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-green-950 dark:text-green-100"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? 'contact-name-error' : undefined
                    }
                    className="w-full rounded-xl border border-green-300 bg-white px-4 py-3 text-green-950 outline-none transition-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-green-700 dark:bg-green-950 dark:text-white"
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1.5 text-sm text-red-700 dark:text-red-300"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-green-950 dark:text-green-100"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? 'contact-email-error' : undefined
                    }
                    className="w-full rounded-xl border border-green-300 bg-white px-4 py-3 text-green-950 outline-none transition-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-green-700 dark:bg-green-950 dark:text-white"
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 text-sm text-red-700 dark:text-red-300"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-green-950 dark:text-green-100"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : undefined
                    }
                    className="w-full resize-y rounded-xl border border-green-300 bg-white px-4 py-3 text-green-950 outline-none transition-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-green-700 dark:bg-green-950 dark:text-white"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="mt-1.5 text-sm text-red-700 dark:text-red-300"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:w-auto"
                >
                  Send Message
                </button>
                {submitted && (
                  <p
                    className="text-sm font-medium text-green-800 dark:text-green-300"
                    role="status"
                  >
                    Thanks for reaching out! Your message has been received.
                  </p>
                )}
              </form>
            </TiltCard>
          </Reveal>

          <aside className="space-y-4 lg:col-span-2" aria-label="Contact details">
            {contactDetails.map(({ title, value, icon: Icon }, index) => (
              <Reveal key={title} delay={index * 0.12}>
                <TiltCard
                  as="article"
                  className="flex items-start gap-4 p-5 sm:p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-green-950 dark:text-green-100">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-green-800 dark:text-gray-300">
                      {value}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </aside>
        </div>
      </div>
    </main>
  )
}
