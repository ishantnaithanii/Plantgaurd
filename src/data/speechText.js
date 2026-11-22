export const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
]

export const packs = {
  'en-US': {
    confidence: 'confidence',
    percent: 'percent',
    treatmentHeading: 'Treatment suggestions',
    diseases: {
      'Early Blight': 'Early Blight',
      'Late Blight': 'Late Blight',
      'Leaf Spot': 'Leaf Spot',
      Healthy: 'Healthy',
    },
    treatments: {
      'Remove infected leaves': {
        title: 'Remove infected leaves',
        desc: 'Remove and discard infected leaves.',
      },
      'Use fungicide': {
        title: 'Use fungicide',
        desc: 'Apply an appropriate fungicide according to its label.',
      },
      'Improve air circulation': {
        title: 'Improve air circulation',
        desc: 'Space plants and prune them to improve airflow.',
      },
      'Water wisely': {
        title: 'Water wisely',
        desc: 'Water at the base of the plant and keep leaves dry.',
      },
      'Remove affected leaves': {
        title: 'Remove affected leaves',
        desc: 'Prune and discard infected foliage to reduce the spread of spores.',
      },
      'Keep foliage dry': {
        title: 'Keep foliage dry',
        desc: 'Water at the base of the plant and allow leaves to dry between watering.',
      },
      'Apply an appropriate fungicide': {
        title: 'Apply an appropriate fungicide',
        desc: 'Use a fungicide labeled for early blight and follow its instructions.',
      },
    },
  },
  'hi-IN': {
    confidence: 'विश्वास स्तर',
    percent: 'प्रतिशत',
    treatmentHeading: 'उपचार के सुझाव',
    diseases: {
      'Early Blight': 'अर्ली ब्लाइट',
      'Late Blight': 'लेट ब्लाइट',
      'Leaf Spot': 'पत्ती धब्बा रोग',
      Healthy: 'स्वस्थ',
    },
    treatments: {
      'Remove infected leaves': {
        title: 'संक्रमित पत्तियाँ हटाएँ',
        desc: 'संक्रमित पत्तियों को हटाकर फेंक दें।',
      },
      'Use fungicide': {
        title: 'फफूंदनाशक का उपयोग करें',
        desc: 'लेबल के निर्देशों के अनुसार उपयुक्त फफूंदनाशक लगाएँ।',
      },
      'Improve air circulation': {
        title: 'हवा का संचार बेहतर करें',
        desc: 'पौधों के बीच जगह रखें और छँटाई करके हवा का प्रवाह बढ़ाएँ।',
      },
      'Water wisely': {
        title: 'सही तरीके से पानी दें',
        desc: 'पौधे की जड़ों में पानी दें और पत्तियों को सूखा रखें।',
      },
      'Remove affected leaves': {
        title: 'प्रभावित पत्तियाँ हटाएँ',
        desc: 'फफूंद के फैलाव को कम करने के लिए संक्रमित पत्तियों की छँटाई करके उन्हें फेंक दें।',
      },
      'Keep foliage dry': {
        title: 'पत्तियों को सूखा रखें',
        desc: 'पौधे की जड़ों में पानी दें और पानी देने के बीच पत्तियों को सूखने दें।',
      },
      'Apply an appropriate fungicide': {
        title: 'उपयुक्त फफूंदनाशक लगाएँ',
        desc: 'अर्ली ब्लाइट के लिए लेबल किए गए फफूंदनाशक का निर्देशानुसार उपयोग करें।',
      },
    },
  },
}

export function buildSpeech(result, lang = 'en-US') {
  const pack = packs[lang] ?? packs['en-US']
  const englishPack = packs['en-US']
  const disease = result?.diseaseName
  const translatedDisease = pack.diseases[disease] ?? disease
  const parts = []

  if (translatedDisease) parts.push(translatedDisease)
  if (Number.isFinite(result?.confidence)) {
    parts.push(
      `${Math.round(result.confidence)} ${pack.percent} ${pack.confidence}`,
    )
  }

  const treatments = result?.treatments ?? []
  if (treatments.length > 0) parts.push(pack.treatmentHeading)

  for (const treatment of treatments) {
    if (typeof treatment === 'string') {
      const translated = pack.treatments[treatment]
      parts.push(translated?.title ?? treatment)
      if (translated?.desc) parts.push(translated.desc)
      continue
    }

    const title = treatment?.title
    const translated = title ? pack.treatments[title] : null
    const english = title ? englishPack.treatments[title] : null
    if (translated?.title ?? title) parts.push(translated?.title ?? title)
    const description = translated?.desc ?? treatment?.description ?? english?.desc
    if (description) parts.push(description)
  }

  return parts.filter(Boolean).join('. ')
}
