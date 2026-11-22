function loadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load the image for cropping.'))
    image.src = imageUrl
  })
}

function getRotatedSize(width, height, rotation) {
  const radians = (rotation * Math.PI) / 180
  return {
    width: Math.ceil(
      Math.abs(Math.cos(radians) * width) +
        Math.abs(Math.sin(radians) * height),
    ),
    height: Math.ceil(
      Math.abs(Math.sin(radians) * width) +
        Math.abs(Math.cos(radians) * height),
    ),
  }
}

export async function getCroppedFile(imageUrl, pixelCrop, rotation, fileName) {
  if (
    !pixelCrop ||
    !Number.isFinite(pixelCrop.x) ||
    !Number.isFinite(pixelCrop.y) ||
    !Number.isFinite(pixelCrop.width) ||
    !Number.isFinite(pixelCrop.height) ||
    pixelCrop.width <= 0 ||
    pixelCrop.height <= 0
  ) {
    throw new Error('The selected crop area is invalid.')
  }

  const image = await loadImage(imageUrl)
  const rotatedSize = getRotatedSize(image.naturalWidth, image.naturalHeight, rotation)
  const rotatedCanvas = document.createElement('canvas')
  rotatedCanvas.width = rotatedSize.width
  rotatedCanvas.height = rotatedSize.height

  const rotatedContext = rotatedCanvas.getContext('2d')
  if (!rotatedContext) throw new Error('Could not access the image canvas.')

  rotatedContext.translate(rotatedSize.width / 2, rotatedSize.height / 2)
  rotatedContext.rotate((rotation * Math.PI) / 180)
  rotatedContext.drawImage(
    image,
    -image.naturalWidth / 2,
    -image.naturalHeight / 2,
  )

  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = Math.round(pixelCrop.width)
  croppedCanvas.height = Math.round(pixelCrop.height)
  const croppedContext = croppedCanvas.getContext('2d')
  if (!croppedContext) throw new Error('Could not access the cropped image canvas.')

  croppedContext.drawImage(
    rotatedCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height,
  )

  const blob = await new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error('Could not encode the cropped image.'))
      },
      'image/jpeg',
      0.92,
    )
  })

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}-cropped.jpg`, { type: 'image/jpeg' })
}
