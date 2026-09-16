const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ohzdqamfuioifrfqlwny.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oemRxYW1mdWlvaWZyZnFsd255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE2NzE3NCwiZXhwIjoyMTA0NzQzMTc0fQ._5akE30BSnXKj-KqhD-7soy1Y4tH0WvTuR99GgalBRA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function count(table) {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  if (error) return `${table}: ERROR ${error.message}`;
  return `${table}: ${count}`;
}

async function main() {
  for (const t of ['metro_lines', 'stations', 'machines', 'users', 'refill_records', 'stock_issues', 'maintenance_records']) {
    console.log(await count(t));
  }
  const { data: lines, error } = await supabase.from('metro_lines').select('id, code, name, status');
  console.log('\nLines:', JSON.stringify(lines, null, 2), error || '');
  const { data: cashTables, error: lcErr } = await supabase.rpc('get_table_name');
  console.log('cash table exists? (rpc)', lcErr ? 'no rpc' : JSON.stringify(cashTables));
}

main().catch(console.error);