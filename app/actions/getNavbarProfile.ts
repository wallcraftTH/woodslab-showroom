'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function getNavbarProfile() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')?.value

    // 1. ถ้าไม่มี Token เลยถือว่า Logout อยู่
    if (!token) {
      return null
    }

    // 2. สร้าง Client ด้วย Token นั้น
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // 3. ✅ สำคัญ: เช็คก่อนว่า Token นี้ยังไม่หมดอายุ
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
       // ถ้า Token หมดอายุ หรือไม่ถูกต้อง ให้ส่ง null กลับไป
       // เพื่อให้ Navbar รู้ตัวว่าต้องแสดงปุ่ม Login
       return null
    }

    // 4. Token ใช้ได้จริง -> ดึงข้อมูล Profile
    const { data: customer, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, created_at')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // กรณีมี User ใน Auth แต่ยังไม่มี Profile ใน DB
      return {
        full_name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: null
      }
    }

    return customer

  } catch (error) {
    console.error("Server Action Error:", error)
    return null
  }
}