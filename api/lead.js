const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, n) => String(v || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (b.website) return res.status(200).json({ ok: true });
  const name = clean(b.name, 120), email = clean(b.email, 200), store = clean(b.store, 300), message = clean(b.message, 3000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name || !message) return res.status(400).json({ ok: false });
  const rows = [['Type', 'New project enquiry'], ['Name', name], ['Email', email], ['Store', store], ['Message', message]].filter((r) => r[1]);
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">' + rows.map((r) => '<p><b>' + esc(r[0]) + ':</b> ' + esc(r[1]).replace(/\n/g, '<br>') + '</p>').join('') + '</div>';
  let sent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'}, body:JSON.stringify({from:process.env.FROM_EMAIL||'Bode Conversion Lab <onboarding@resend.dev>',to:[process.env.LEAD_TO||'bodeagencyofficial@gmail.com'],reply_to:email,subject:'New project enquiry: '+(store||name),html}) });
      sent = r.ok;
    } catch (e) {}
  }
  if (process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const r = await fetch('https://api.telegram.org/bot'+process.env.TELEGRAM_TOKEN+'/sendMessage', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:process.env.TELEGRAM_CHAT_ID,text:'New project enquiry\n'+rows.slice(1).map(r=>r[0]+': '+r[1]).join('\n')})});
      sent = sent || r.ok;
    } catch (e) {}
  }
  return res.status(sent ? 200 : 502).json({ok:sent});
}