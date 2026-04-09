'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function updateProfile(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value

  if (!token) redirect('/login')

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl = null

  if (avatarFile && avatarFile.size > 0) {
    const fileName = `${user.id}-${Date.now()}.webp`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase
      .storage
      .from('profiles')
      .upload(fileName, avatarFile, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError) return { error: 'Upload failed', success: false }
    avatarUrl = filePath
  }

  const updateData: any = {
    full_name: fullName,
    phone: phone,
  }

  if (avatarUrl) updateData.avatar_url = avatarUrl

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (error) return { error: 'Update failed', success: false }

  revalidatePath('/profile')
  return { message: 'บันทึกข้อมูลสำเร็จ', success: true }
}