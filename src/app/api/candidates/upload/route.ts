import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTextFromFile, extractNameFromFilename } from '@/lib/cv/extract'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const formData = await request.formData()
    const jobId = formData.get('jobId') as string
    const files = formData.getAll('files') as File[]

    if (!jobId) return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    if (!files || files.length === 0) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

    const { data: job } = await supabase.from('jobs').select('id').eq('id', jobId).eq('user_id', user.id).single()
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const results = []
    for (const file of files) {
      try {
        if (file.size > 10 * 1024 * 1024) { results.push({ name: file.name, error: 'File too large.' }); continue }
        const buffer = Buffer.from(await file.arrayBuffer())
        const { text, error: extractError } = await extractTextFromFile(buffer, file.name)
        if (extractError || !text) { results.push({ name: file.name, error: extractError ?? 'Could not extract text.' }); continue }
        const fileName = user.id + '/' + jobId + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const { data: uploadData, error: uploadError } = await supabase.storage.from('cvs').upload(fileName, buffer, { contentType: file.type })
        if (uploadError) { results.push({ name: file.name, error: 'Failed to store file.' }); continue }
        const candidateName = extractNameFromFilename(file.name)
        const { data: candidate, error: dbError } = await supabase.from('candidates').insert({ job_id: jobId, name: candidateName, cv_url: uploadData.path, cv_text: text, status: 'pending' }).select().single()
        if (dbError) { results.push({ name: file.name, error: 'Failed to save candidate.' }); continue }
        results.push({ name: file.name, candidateId: candidate.id, success: true })
      } catch (err) {
        results.push({ name: file.name, error: 'Unexpected error.' })
      }
    }
    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}