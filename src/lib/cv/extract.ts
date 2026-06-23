interface ExtractResult {
  text: string | null
  error: string | null
}

export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<ExtractResult> {
  const ext = filename.toLowerCase().split('.').pop()
  try {
    if (ext === 'pdf') return await extractFromPDF(buffer)
    if (ext === 'docx') return await extractFromDocx(buffer)
    return { text: null, error: 'Unsupported file type.' }
  } catch (err) {
    return { text: null, error: 'Failed to read file content.' }
  }
}

async function extractFromPDF(buffer: Buffer): Promise<ExtractResult> {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer, { max: 10 })
    const text = data.text?.trim()
    if (!text || text.length < 50) return { text: null, error: 'PDF appears to be scanned or image-based.' }
    return { text: cleanText(text), error: null }
  } catch (err) {
    return { text: null, error: 'Could not parse PDF. The file may be corrupted or password-protected.' }
  }
}

async function extractFromDocx(buffer: Buffer): Promise<ExtractResult> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value?.trim()
    if (!text || text.length < 50) return { text: null, error: 'Word document appears to be empty.' }
    return { text: cleanText(text), error: null }
  } catch (err) {
    return { text: null, error: 'Could not parse Word document.' }
  }
}

function cleanText(text: string): string {
  return text.replace(/
/g, '
').replace(/
/g, '
').replace(/
{3,}/g, '

').replace(/[ 	]{2,}/g, ' ').trim().slice(0, 15000)
}

export function extractNameFromFilename(filename: string): string | null {
  const base = filename.replace(/.(pdf|docx|doc)$/i, '')
  const cleaned = base.replace(/^(cv|resume|curriculum.vitae)[s_-]*/i, '').replace(/[s_-]*(cv|resume|curriculum.vitae)$/i, '').replace(/[_-]/g, ' ').replace(/s+/g, ' ').trim()
  const words = cleaned.split(' ').filter(Boolean)
  if (words.length >= 2 && words.length <= 4 && words.every(w => /^[a-zA-Z'-]+$/.test(w))) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
  }
  return null
}