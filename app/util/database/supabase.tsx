import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export const supabaseSelectAll = async (table: string) => {
  const { data, error } = await supabase.from(table).select('*')
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectSingle = async (table: string) => {
  const { data, error } = await supabase.from(table).select('*').single()
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectWhere = async (
  table: string,
  column: string,
  value: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectWhereSingle = async (
  table: string,
  column: string,
  value: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
    .single()
  if (error) {
    console.log(error)
    return null
  }
  return data
}

export const supabaseSelectContains = async (
  table: string,
  column: string,
  value: string[]
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .contains(column, [value])
  if (error) {
    console.log(error)
    return null
  }
  return data
}
