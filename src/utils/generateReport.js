import { jsPDF } from 'jspdf'

const PAGE_HEIGHT = 297
const MARGIN = 15
const CONTENT_BOTTOM = PAGE_HEIGHT - 25

function loadImageData(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('Could not prepare the uploaded image for the report.'))
        return
      }

      context.drawImage(image, 0, 0)
      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.9),
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }
    image.onerror = () => reject(new Error('Could not load the uploaded image.'))
    image.src = imageUrl
  })
}

function safeFilename(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'plant-disease'
}

export async function generateReport({ result, imageUrl, fileName }) {
  if (!result || !imageUrl || !fileName) {
    throw new Error('Report data and the uploaded image are required.')
  }

  const image = await loadImageData(imageUrl)
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const now = new Date()
  let y = 40

  doc.setFillColor(27, 67, 50)
  doc.rect(0, 0, pageWidth, 28, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text('PlantGuard - Plant Disease Report', MARGIN, 18)

  doc.setTextColor(55, 75, 65)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Date and time: ${now.toLocaleString()}`, MARGIN, y)
  y += 7
  doc.text(`Image: ${fileName}`, MARGIN, y)
  y += 8

  const imageMaxWidth = 80
  const imageMaxHeight = 65
  const imageScale = Math.min(
    imageMaxWidth / image.width,
    imageMaxHeight / image.height,
  )
  const imageWidth = image.width * imageScale
  const imageHeight = image.height * imageScale
  doc.addImage(
    image.dataUrl,
    'JPEG',
    MARGIN,
    y,
    imageWidth,
    imageHeight,
  )
  y += imageHeight + 10

  doc.setTextColor(27, 67, 50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  const diseaseLines = doc.splitTextToSize(
    result.diseaseName || 'Unknown disease',
    pageWidth - MARGIN * 2,
  )
  doc.text(diseaseLines, MARGIN, y)
  y += diseaseLines.length * 7

  doc.setFont('times', 'italic')
  doc.setFontSize(11)
  doc.setTextColor(82, 121, 111)
  const scientificLines = doc.splitTextToSize(
    result.scientificName || 'Scientific name unavailable',
    pageWidth - MARGIN * 2,
  )
  doc.text(scientificLines, MARGIN, y)
  y += scientificLines.length * 6 + 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(45, 106, 79)
  doc.text(`Confidence: ${Math.round(result.confidence || 0)}%`, MARGIN, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(
    `Confidence level: ${result.confidenceLevel || getConfidenceLevel(result.confidence)}`,
    MARGIN,
    y,
  )
  y += 8

  const addPageIfNeeded = (requiredHeight = 5) => {
    if (y + requiredHeight > CONTENT_BOTTOM) {
      doc.addPage()
      y = MARGIN
    }
  }

  const predictions = Array.isArray(result.predictions) ? result.predictions : []
  if (predictions.length > 0) {
    addPageIfNeeded(12)
    doc.setTextColor(27, 67, 50)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Top Predictions', MARGIN, y)
    y += 8

    for (const prediction of predictions) {
      if (
        typeof prediction?.label !== 'string' ||
        !Number.isFinite(prediction.score)
      ) {
        continue
      }

      addPageIfNeeded(6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 75, 65)
      doc.text(
        `${prediction.label}: ${Math.round(prediction.score)}%`,
        MARGIN,
        y,
      )
      y += 6
    }
    y += 4
  }

  addPageIfNeeded(12)
  doc.setTextColor(27, 67, 50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Treatment Suggestions', MARGIN, y)
  y += 9

  const treatments = Array.isArray(result.treatments) ? result.treatments : []
  for (const treatment of treatments) {
    const title =
      typeof treatment === 'string' ? treatment : treatment?.title || 'Treatment'
    const description =
      typeof treatment === 'string' ? '' : treatment?.description || ''
    const titleLines = doc.splitTextToSize(title, pageWidth - MARGIN * 2)
    const descriptionLines = description
      ? doc.splitTextToSize(description, pageWidth - MARGIN * 2)
      : []
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(27, 67, 50)
    titleLines.forEach((line) => {
      addPageIfNeeded(6)
      doc.text(line, MARGIN, y)
      y += 6
    })

    if (descriptionLines.length) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(82, 121, 111)
      descriptionLines.forEach((line) => {
        addPageIfNeeded(5)
        doc.text(line, MARGIN, y)
        y += 5
      })
    }
    y += 6
  }

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 115, 107)
    doc.text(
      'This is an AI prediction and may not be 100% accurate. Please confirm with an expert.',
      MARGIN,
      PAGE_HEIGHT - 15,
    )
    doc.text(
      'Generated by PlantGuard',
      pageWidth - MARGIN,
      PAGE_HEIGHT - 8,
      { align: 'right' },
    )
  }

  const date = now.toISOString().slice(0, 10)
  doc.save(`PlantGuard-Report-${safeFilename(result.diseaseName || 'disease')}-${date}.pdf`)
}

function getConfidenceLevel(confidence) {
  const score = Number.isFinite(confidence) ? confidence : 0
  if (score >= 80) return 'High confidence'
  if (score >= 60) return 'Medium confidence'
  return 'Low confidence'
}
