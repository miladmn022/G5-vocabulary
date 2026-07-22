import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE URL or SERVICE ROLE KEY in env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const TARGET_EMAIL = 'milad@axorizen.com'
const TARGET_PASSWORD = 'Milad@1809'

const DEMO_EMAIL = 'milad@axorizen.com'

async function main() {

  const { data: demoList, error: demoErr } = await supabase.auth.admin.listUsers()
  if (demoErr) throw demoErr

  const demoUser = demoList.users.find(u => u.email?.toLowerCase() === DEMO_EMAIL.toLowerCase())
  if (!demoUser) {
    throw new Error(`Demo user not found: ${DEMO_EMAIL}`)
  }

  
  const existingMilad = demoList.users.find(u => u.email?.toLowerCase() === TARGET_EMAIL.toLowerCase())

  if (existingMilad && existingMilad.id !== demoUser.id) {
    console.log('Deleting existing milad user:', existingMilad.id)

    // اگر جدول profiles داری
    await supabase.from('profiles').delete().eq('id', existingMilad.id)
    await supabase.from('users').delete().eq('id', existingMilad.id)

    const { error: deleteErr } = await supabase.auth.admin.deleteUser(existingMilad.id)
    if (deleteErr) throw deleteErr
  }

 
  const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(demoUser.id, {
    email: TARGET_EMAIL,
    password: TARGET_PASSWORD,
    email_confirm: true,
    user_metadata: {
      role: 'superadmin'
    }
  })

  if (updateErr) throw updateErr


  await supabase.from('profiles').upsert({
    id: demoUser.id,
    email: TARGET_EMAIL,
    role: 'superadmin'
  })

  await supabase.from('users').upsert({
    id: demoUser.id,
    email: TARGET_EMAIL,
    role: 'superadmin'
  })

  console.log('Done:', updated.user?.email, updated.user?.id)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
