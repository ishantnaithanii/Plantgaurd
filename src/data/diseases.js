const diseases = [
  {
    name: 'Early Blight',
    scientificName: 'Alternaria solani',
    symptoms: [
      'Dark brown spots with concentric rings, often described as a target pattern.',
      'Yellowing around spots, usually beginning on older lower leaves.',
      'Leaves may dry out and drop as symptoms progress.',
    ],
    prevention: [
      'Rotate crops and avoid planting tomatoes or potatoes in the same soil each year.',
      'Water at the base of plants and avoid wetting foliage.',
      'Remove infected plant debris and provide space for good airflow.',
    ],
  },
  {
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    symptoms: [
      'Irregular, water-soaked green or brown patches that can enlarge quickly.',
      'White fuzzy growth may appear on the underside of leaves in humid conditions.',
      'Dark lesions can develop on stems and fruit.',
    ],
    prevention: [
      'Use healthy, disease-free seed and transplants.',
      'Avoid overhead watering and improve air circulation around plants.',
      'Remove infected plants and volunteer potatoes promptly.',
    ],
  },
  {
    name: 'Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    symptoms: [
      'Small, round spots with dark margins and pale or gray centers.',
      'Tiny dark dots may be visible in the centers of mature spots.',
      'Heavily affected lower leaves yellow, wither, and fall.',
    ],
    prevention: [
      'Mulch around plants to reduce soil splash onto lower leaves.',
      'Water at soil level and avoid handling plants when foliage is wet.',
      'Remove diseased leaves and clear plant debris after harvest.',
    ],
  },
  {
    name: 'Bacterial Spot',
    scientificName: 'Xanthomonas species',
    symptoms: [
      'Small, dark, water-soaked spots that may have yellow halos.',
      'Spots can become rough or raised on fruit.',
      'Severe infections may cause leaf yellowing and drop.',
    ],
    prevention: [
      'Start with certified disease-free seeds and transplants.',
      'Avoid working among plants when they are wet.',
      'Rotate crops and sanitize tools and containers between plantings.',
    ],
  },
]

export default diseases
