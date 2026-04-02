'use server'

import { supabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const TABLE = "products"

// ⚠️ อันเดิมเก็บไว้ (เผื่อใช้ในฟังก์ชันอื่นที่อยากเห็นของหมด)
const LIST_SELECT = "id,name,sku,barcode,price,image_url,status,specs,updated_at,created_at,stock(qty)"

// --- Helper Functions ---
const getDbCategory = (category: string) => category === 'rough' ? 'rough_wood' : 'SLABS'

// 🔹 ฟังก์ชันสร้าง Client แบบอ่าน Cookie (สำหรับระบบ User/Auth)
async function createAuthClient() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value

  if (!token) return null

  return createClient(
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
}

export type FilterState = {
  type: string
  material: string
  panel: string
  status: string
  lengthMin: string
  lengthMax: string
  widthMin: string
  widthMax: string
  thickMin: string
  thickMax: string
  priceMin: string
  priceMax: string
  q: string
  discount: string
}

// ==========================================
// 1. ส่วนดึงข้อมูลสำหรับหน้า Main Listing
// ==========================================

// 1.1 ดึงส่วนลด
export async function getActiveDiscounts() {
  const { data, error } = await supabaseServer
    .from('discounts')
    .select('*, discount_rules(*)')
    .eq('active', true)
  if (error) return []
  return data || []
}

// 1.2 ✅ กรองสินค้าหลัก (Main Listing)
export async function getProducts(page: number, limit: number, filters: FilterState, category: 'slabs' | 'rough' = 'slabs') {
  const offset = page * limit
  const targetCategory = getDbCategory(category) // แปลงค่า

  const LIST_SELECT_ACTIVE = "id,name,sku,barcode,price,image_url,status,specs,updated_at,created_at,category_id,stock(qty)"

  let query = supabaseServer
    .from(TABLE)
    .select(LIST_SELECT_ACTIVE)
    .eq('category_id', targetCategory) // 🔥 กรองจาก category_id ตรงๆ
    .range(offset, offset + limit - 1)
    .order('status', { ascending: true })
    .order('updated_at', { ascending: false })

  // --- Apply Filters (โลจิกเดิม) ---
  if (filters.type) query = query.eq('specs->>spec_type', filters.type)
  if (filters.material) query = query.eq('specs->>material', filters.material)
  if (filters.panel) query = query.eq('specs->>panel_craft', filters.panel)

  const statusMap: Record<string, string[]> = {
    available: ["available", "active"],
    pending: ["pending", "reserved", "hold", "on_request"],
    sold: ["sold", "archived", "inactive"],
    draft: ["draft"],
  }
  
  if (filters.status !== 'all' && statusMap[filters.status]) {
    query = query.in('status', statusMap[filters.status])
  }

  if (filters.lengthMin) query = query.gte('specs->>length_cm', Number(filters.lengthMin))
  if (filters.lengthMax) query = query.lte('specs->>length_cm', Number(filters.lengthMax))
  
  if (filters.widthMin) query = query.gte('specs->>width_cm', Number(filters.widthMin))
  if (filters.widthMax) query = query.lte('specs->>width_cm', Number(filters.widthMax))

  if (filters.thickMin) query = query.gte('specs->>thickness_cm', Number(filters.thickMin))
  if (filters.thickMax) query = query.lte('specs->>thickness_cm', Number(filters.thickMax))

  if (filters.priceMin) query = query.gte('price', Number(filters.priceMin))
  if (filters.priceMax) query = query.lte('price', Number(filters.priceMax))

  if (filters.q) {
    const qq = filters.q.replaceAll(",", " ")
    query = query.or(`name.ilike.%${qq}%,barcode.ilike.%${qq}%,sku.ilike.%${qq}%`)
  }

  const { data } = await query
  return data || []
}

// 1.3 ✅ ดึงค่า Min/Max สำหรับ Slider
export async function getMinMax(col: string, category: 'slabs' | 'rough' = 'slabs') {
  const targetCategory = getDbCategory(category)

  const { data: minData } = await supabaseServer
    .from(TABLE)
    .select(col)
    .eq('category_id', targetCategory) // 🔥 กรองจาก category_id
    .not(col, 'is', null)
    .order(col, { ascending: true })
    .limit(1)
    .single()

  const { data: maxData } = await supabaseServer
    .from(TABLE)
    .select(col)
    .eq('category_id', targetCategory) // 🔥 กรองจาก category_id
    .not(col, 'is', null)
    .order(col, { ascending: false })
    .limit(1)
    .single()

  return { 
    min: minData ? minData[col] : null, 
    max: maxData ? maxData[col] : null 
  }
}

// 1.4 ✅ ดึงค่าสำหรับ Histogram
export async function getRangeValues(col: string, category: 'slabs' | 'rough' = 'slabs') {
  const targetCategory = getDbCategory(category)

  const { data } = await supabaseServer
    .from(TABLE)
    .select(col)
    .eq('category_id', targetCategory) // 🔥 กรองจาก category_id
    .not(col, 'is', null)
    .limit(2000)

  if (!data) return []
  return data.map((r: any) => Number(r[col])).filter(n => Number.isFinite(n))
}

// 1.5 ✅ ดึงตัวเลือกสำหรับ Dropdown
export async function getDistinctOptions(category: 'slabs' | 'rough' = 'slabs') {
  const targetCategory = getDbCategory(category)

  const { data } = await supabaseServer
    .from(TABLE)
    .select('specs')
    .eq('category_id', targetCategory) // 🔥 กรองจาก category_id
    .limit(3000)

  const sets = {
    type: new Set<string>(),
    material: new Set<string>(),
    panel: new Set<string>()
  }

  data?.forEach((r: any) => {
    const s = r.specs || {}
    if (s.spec_type) sets.type.add(s.spec_type)
    if (s.material) sets.material.add(s.material)
    if (s.panel_craft) sets.panel.add(s.panel_craft)
  })

  return {
    type: Array.from(sets.type).sort((a, b) => a.localeCompare(b)),
    material: Array.from(sets.material).sort((a, b) => a.localeCompare(b)),
    panel: Array.from(sets.panel).sort((a, b) => a.localeCompare(b))
  }
}
// ==========================================
// 2. ส่วน Product Detail
// ==========================================

export async function getProductDetail(id?: string) {
  if (!id) return null
  // ⚠️ หน้ารายละเอียดคงไว้แบบเดิม (Left Join) เพื่อให้ยังเข้าดูของที่หมดแล้วได้ (แต่จะขึ้น Sold Out)
  const { data } = await supabaseServer.from(TABLE).select('*, stock(qty)').eq('id', id).single()
  return data
}

// ✅ อัลกอริทึมแนะนำสินค้า (Demo Version): แสดงสินค้าทั้งหมดไม่สน Status เอาให้เต็ม 8 ช่อง
export async function getRecommendProducts(currentId: number | string, specs: any) {
  const material = specs?.material || ""
  
  const isRough = specs?.type === 'rough' || (specs?.sku && specs.sku.startsWith('ROUGH-'))
  const prefix = isRough ? 'ROUGH-' : 'WOODSLABS'

  const selectCols = "id,name,sku,price,image_url,status,specs,updated_at,favorite_count,stock(qty)"

  // 🎯 Step 1: หาแผ่นที่ "ชนิดไม้เดียวกัน (Material)"
  // เรียงตามความนิยม (favorite_count) ให้หน้าเดโมดูเนียนตา
  let q1 = supabaseServer
    .from(TABLE)
    .select(selectCols)
    .ilike("sku", `${prefix}%`)
    // ❌ เอาบรรทัดกรอง status ออกแล้ว เพื่อโชว์ทุกอย่าง
    .neq("id", currentId)
    
  if (material) {
      q1 = q1.eq("specs->>material", material)
  }

  q1 = q1.order("favorite_count", { ascending: false }) 
         .order("updated_at", { ascending: false })     
         .limit(8)

  const { data: matchedMaterial } = await q1
  let results = matchedMaterial || []

  // 🎯 Step 2: ถ้าไม้ชนิดเดียวกันมีไม่ถึง 8 แผ่น (ในเดโมของอาจจะยังน้อย)
  // ให้ดึง "สินค้ายอดฮิตที่สุดในเดโม" มาเติมให้เต็ม 8 กรอบ
  if (results.length < 8) {
    const existingIds = new Set(results.map(r => r.id))
    existingIds.add(currentId)

    const { data: popularData } = await supabaseServer
      .from(TABLE)
      .select(selectCols)
      .ilike("sku", `${prefix}%`)
      // ❌ เอาบรรทัดกรอง status ออกแล้ว
      .order("favorite_count", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(15) 

    if (popularData) {
      for (const item of popularData) {
        if (!existingIds.has(item.id)) {
          results.push(item)
          existingIds.add(item.id)
        }
        // เติมจนครบ 8 แผ่นแล้วหยุด หน้าเว็บจะได้เรียงกรอบสวยๆ พอดี
        if (results.length >= 8) break; 
      }
    }
  }

  return results
}
export async function purchaseProduct(id: number) {
  const { error } = await supabaseServer.from(TABLE).update({ status: 'on_request', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/woodslab/product')
  return { success: true }
}

// ==========================================
// 3. ส่วนของ Favorite / Like System (✅ เวอร์ชั่นสมบูรณ์)
// ==========================================

export async function getProductLikeStatus(productId: string) {
  const authClient = await createAuthClient()
  let isLiked = false
  let isLoggedIn = false

  if (authClient) {
     const { data: { user } } = await authClient.auth.getUser()
     if (user) {
        isLoggedIn = true 
        const { data: fav } = await authClient
          .from('favorites')
          .select('id')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .single()
        if (fav) isLiked = true
     }
  }

  const { data: product } = await supabaseServer
    .from(TABLE)
    .select('favorite_count')
    .eq('id', productId)
    .single()
  
  return { count: product?.favorite_count || 0, isLiked, isLoggedIn }
}

export async function toggleProductLike(productId: string) {
  const authClient = await createAuthClient()
  if (!authClient) throw new Error("Must be logged in to like")

  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error("Invalid session")

  const { data: existing } = await authClient
    .from('favorites')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await authClient.from('favorites').delete().eq('id', existing.id)
  } else {
    await authClient.from('favorites').insert({ user_id: user.id, product_id: productId })
  }

  revalidatePath('/woodslab/product') 
  return { success: true }
}

export async function getMyFavorites() {
  const authClient = await createAuthClient()
  if (!authClient) return []
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return []

  const { data, error } = await authClient
    .from('favorites')
    // ✅ Favorites: ปล่อยให้เห็นของหมดได้ (จะได้รู้ว่าสินค้าที่ชอบหมดแล้ว)
    .select(`product_id, products (id, name, sku, price, image_url, specs, status, stock(qty))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  const products = data?.map((item: any) => item.products).filter(Boolean) || []
  return products
}