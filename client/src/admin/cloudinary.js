export async function uploadToCloudinary({ file, signatureData }) {
  const { cloudName, apiKey, timestamp, folder, signature } = signatureData

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)
  form.append('folder', folder)

  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Cloudinary upload failed')
  return await res.json()
}

