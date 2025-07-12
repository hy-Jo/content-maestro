import { createClient } from '@supabase/supabase-js'

// 서비스 롤을 사용하는 Supabase 클라이언트
// 이 클라이언트는 RLS 정책을 우회하여 모든 테이블에 접근할 수 있습니다.
// 주의: 이 클라이언트는 서버 측 코드에서만 사용해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey) 