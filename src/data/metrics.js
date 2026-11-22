// Replace with real results after training
const metrics = {
  overallAccuracy: 0.92,
  macroPrecision: 0.91,
  macroRecall: 0.9,
  macroF1: 0.9,
  classes: [
    { name: 'Early Blight', precision: 0.93, recall: 0.92, f1: 0.92, support: 48 },
    { name: 'Late Blight', precision: 0.9, recall: 0.88, f1: 0.89, support: 42 },
    { name: 'Leaf Spot', precision: 0.88, recall: 0.89, f1: 0.88, support: 36 },
    { name: 'Healthy', precision: 0.94, recall: 0.93, f1: 0.93, support: 54 },
  ],
  confusionMatrix: [
    [44, 2, 1, 1],
    [3, 37, 1, 1],
    [1, 2, 32, 1],
    [1, 1, 2, 50],
  ],
}

export default metrics
