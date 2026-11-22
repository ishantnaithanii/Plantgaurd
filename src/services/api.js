export async function predictDisease(file) {
  if (!file) {
    throw new Error('An image file is required to predict plant disease.')
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    confidence: 94,
    predictions: [
      { label: 'Early Blight', score: 92 },
      { label: 'Late Blight', score: 5 },
      { label: 'Leaf Spot', score: 3 },
    ],
    treatments: [
      {
        title: 'Remove affected leaves',
        description:
          'Prune and discard infected foliage to reduce the spread of spores.',
      },
      {
        title: 'Keep foliage dry',
        description:
          'Water at the base of the plant and allow leaves to dry between watering.',
      },
      {
        title: 'Apply an appropriate fungicide',
        description:
          'Use a fungicide labeled for early blight and follow its instructions.',
      },
    ],
  }
}