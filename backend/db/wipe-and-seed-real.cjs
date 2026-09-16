const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ohzdqamfuioifrfqlwny.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oemRxYW1mdWlvaWZyZnFsd255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTE2NzE3NCwiZXhwIjoyMTA0NzQzMTc0fQ._5akE30BSnXKj-KqhD-7soy1Y4tH0WvTuR99GgalBRA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LINES = [
  { id: 'b2000000-0000-0000-0000-000000000001', code: 'RD7', name: 'Red Line 7', description: 'Gundavali–Ovaripada elevated corridor (Line 7)', status: 'ACTIVE', created_by: 'a0000000-0000-0000-0000-000000000001' },
  { id: 'b2000000-0000-0000-0000-000000000002', code: 'YL2A', name: 'Yellow Line 2A', description: 'Dahisar East–Andheri West corridor (Line 2A)', status: 'ACTIVE', created_by: 'a0000000-0000-0000-0000-000000000001' },
];

const STATIONS = [
  // Red Line 7
  { id: 'c2000000-0000-0000-0000-000000000001', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-GND', name: 'Gundavali', description: 'Gundavali metro station' },
  { id: 'c2000000-0000-0000-0000-000000000002', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-MOG', name: 'Mogra', description: 'Mogra metro station' },
  { id: 'c2000000-0000-0000-0000-000000000003', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-JWE', name: 'Jogeshwari East', description: 'Jogeshwari East metro station' },
  { id: 'c2000000-0000-0000-0000-000000000004', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-GRE', name: 'Goregaon East', description: 'Goregaon East metro station' },
  { id: 'c2000000-0000-0000-0000-000000000005', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-ARY', name: 'Aarey', description: 'Aarey metro station' },
  { id: 'c2000000-0000-0000-0000-000000000006', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-DND', name: 'Dindoshi', description: 'Dindoshi metro station' },
  { id: 'c2000000-0000-0000-0000-000000000007', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-KUR', name: 'Kurar', description: 'Kurar metro station' },
  { id: 'c2000000-0000-0000-0000-000000000008', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-AKL', name: 'Akurli', description: 'Akurli metro station' },
  { id: 'c2000000-0000-0000-0000-000000000009', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-PSR', name: 'Poisar', description: 'Poisar metro station' },
  { id: 'c2000000-0000-0000-0000-000000000010', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-MGT', name: 'Magathane', description: 'Magathane metro station' },
  { id: 'c2000000-0000-0000-0000-000000000011', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-DVP', name: 'Devipada', description: 'Devipada metro station' },
  { id: 'c2000000-0000-0000-0000-000000000012', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-RSU', name: 'Rashtriya Udyan', description: 'Rashtriya Udyan metro station (National Park)' },
  { id: 'c2000000-0000-0000-0000-000000000013', line_id: 'b2000000-0000-0000-0000-000000000001', station_code: 'RD7-OVP', name: 'Ovaripada', description: 'Ovaripada metro station' },

  // Yellow Line 2A
  { id: 'c2000000-0000-0000-0000-000000000014', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-DHE', name: 'Dahisar East', description: 'Dahisar East metro station' },
  { id: 'c2000000-0000-0000-0000-000000000015', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-ANA', name: 'Anand Nagar', description: 'Anand Nagar metro station' },
  { id: 'c2000000-0000-0000-0000-000000000016', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-KDP', name: 'Kandarpada', description: 'Kandarpada metro station' },
  { id: 'c2000000-0000-0000-0000-000000000017', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-MDP', name: 'Mandapeshwar-IC Colony', description: 'Mandapeshwar-IC Colony metro station' },
  { id: 'c2000000-0000-0000-0000-000000000018', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-EKS', name: 'Eksar', description: 'Eksar metro station' },
  { id: 'c2000000-0000-0000-0000-000000000019', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-BRV', name: 'Borivali West', description: 'Borivali West metro station' },
  { id: 'c2000000-0000-0000-0000-000000000020', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-PEK', name: 'Pahadi Eksar', description: 'Pahadi Eksar metro station' },
  { id: 'c2000000-0000-0000-0000-000000000021', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-KWL', name: 'Kandivali West', description: 'Kandivali West metro station' },
  { id: 'c2000000-0000-0000-0000-000000000022', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-DKW', name: 'Dahanukarwadi', description: 'Dahanukarwadi metro station' },
  { id: 'c2000000-0000-0000-0000-000000000023', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-VLN', name: 'Valnai', description: 'Valnai metro station' },
  { id: 'c2000000-0000-0000-0000-000000000024', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-MKW', name: 'Malad West', description: 'Malad West metro station' },
  { id: 'c2000000-0000-0000-0000-000000000025', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-LML', name: 'Lower Malad', description: 'Lower Malad metro station' },
  { id: 'c2000000-0000-0000-0000-000000000026', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-PGR', name: 'Pahadi Goregaon', description: 'Pahadi Goregaon metro station' },
  { id: 'c2000000-0000-0000-0000-000000000027', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-GRW', name: 'Goregaon West', description: 'Goregaon West metro station' },
  { id: 'c2000000-0000-0000-0000-000000000028', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-OSW', name: 'Oshiwara', description: 'Oshiwara metro station' },
  { id: 'c2000000-0000-0000-0000-000000000029', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-LOS', name: 'Lower Oshiwara', description: 'Lower Oshiwara metro station' },
  { id: 'c2000000-0000-0000-0000-000000000030', line_id: 'b2000000-0000-0000-0000-000000000002', station_code: 'YL2A-ANW', name: 'Andheri West', description: 'Andheri West metro station' },
];

function makeMachines(station) {
  const code = station.station_code;
  return {
    id: station.id.replace('c2000000', 'd2000000'),
    machine_id: `PAD-${code}-01`,
    station_id: station.id,
    line_id: station.line_id,
    location: 'Platform 1',
    machine_type: 'Standard',
    capacity: 50,
    current_stock: 0,
    low_stock_threshold: 10,
    installation_date: '2026-07-12',
    status: 'ACTIVE',
    created_by: 'a0000000-0000-0000-0000-000000000001',
  };
}

async function run() {
  console.log('=== DELETE DEMO DATA ===');

  // Delete in FK-safe order
  for (const table of ['pad_stock', 'refill_records', 'stock_issues', 'maintenance_records', 'machine_status_history', 'audit_logs', 'machines', 'stations', 'metro_lines']) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error && error.code !== '23503') {
      console.error(`  DELETE ${table}: ${error.message}`);
    } else {
      console.log(`  Deleted ${table}`);
    }
  }

  console.log('\n=== INSERT LINES ===');
  const { error: lineErr } = await supabase.from('metro_lines').insert(LINES);
  if (lineErr) console.error(`  INSERT lines: ${lineErr.message}`);
  else console.log('  Inserted 2 lines');

  console.log('\n=== INSERT STATIONS ===');
  const { error: stErr } = await supabase.from('stations').insert(STATIONS);
  if (stErr) console.error(`  INSERT stations: ${stErr.message}`);
  else console.log('  Inserted 30 stations');

  const machines = STATIONS.map(makeMachines);

  console.log('\n=== INSERT MACHINES ===');
  const { error: mErr } = await supabase.from('machines').insert(machines);
  if (mErr) console.error(`  INSERT machines: ${mErr.message}`);
  else console.log('  Inserted 30 machines');

  console.log('\nDone. Cash collections must be run via SQL Editor (apply-real-data.sql).');
}

run().catch(console.error);