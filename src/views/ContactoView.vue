<script setup lang="ts">
import { ref } from 'vue'

interface ChatMsg {
  from: 'bot' | 'user'
  text: string
}

const channels = [
  { icon: '◐', label: 'Instagram', val: '@size.ec' },
  { icon: '◑', label: 'WhatsApp',  val: '+593 99 000 0000' },
  { icon: '◒', label: 'Mail',      val: 'hola@size.ec' },
  { icon: '◓', label: 'Facebook',  val: 'fb.com/sizeagency' }
]

// Stub of "La Bruja" chatbot — the prototype calls window.claude.complete which only
// exists inside Claude.ai's sandbox. We render the same UI; the real provider is wired
// in Phase 8 (Integraciones). For now an outgoing message gets a canned redirect to
// Facebook (matching the prototype's catch-all fallback).
const msgs = ref<ChatMsg[]>([
  { from: 'bot', text: 'Hola. Soy la Bruja de SIZE. Cuéntame qué necesitas y te llevo con la persona correcta.' }
])
const input = ref('')
const busy = ref(false)

function send() {
  const text = input.value.trim()
  if (!text || busy.value) return
  input.value = ''
  msgs.value.push({ from: 'user', text })
  busy.value = true
  window.setTimeout(() => {
    msgs.value.push({
      from: 'bot',
      text: 'Mejor escríbeme directo a Facebook: fb.com/sizeagency'
    })
    busy.value = false
  }, 600)
}
</script>

<template>
  <section class="ct-head">
    <h1 class="size-wordmark med">SIZE</h1>
    <div class="mono upper ct-eyebrow">Contacto</div>
  </section>

  <section class="ct-body">
    <div class="ct-grid">
      <!-- LEFT 40% — channels -->
      <div class="ct-channels">
        <div class="mono upper ct-channels-eyebrow">Canales</div>
        <ul class="ct-list">
          <li v-for="c in channels" :key="c.label" class="ct-list-row">
            <span class="ct-icon">{{ c.icon }}</span>
            <div>
              <div class="mono upper ct-list-label">{{ c.label }}</div>
              <div class="ct-list-val">{{ c.val }}</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- RIGHT 60% — chatbot stub -->
      <div class="ct-bot">
        <div class="mono upper ct-bot-eyebrow">Pregúntale a la Bruja</div>
        <h3 class="ct-bot-title">¿Qué necesitas?</h3>

        <div class="ct-bot-feed">
          <div
            v-for="(m, i) in msgs"
            :key="i"
            class="ct-msg"
            :class="m.from === 'user' ? 'ct-msg-user' : 'ct-msg-bot'"
          >
            {{ m.text }}
          </div>
          <div v-if="busy" class="mono ct-busy">la bruja está pensando…</div>
        </div>

        <div class="ct-bot-input">
          <input
            v-model="input"
            class="ct-input"
            placeholder="Cuéntame…"
            @keydown.enter="send"
          />
          <button class="bright-cta ct-send" :disabled="busy" @click="send">Enviar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ct-head { padding: 6vh 6vw 2vh; text-align: center; }
.ct-eyebrow { font-size: 11px; color: var(--muted); margin-top: 16px; }

.ct-body { padding: 4vh 6vw 8vh; }
.ct-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: start;
}

/* LEFT */
.ct-channels {
  padding: 32px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
}
.ct-channels-eyebrow { font-size: 11px; opacity: 0.7; margin-bottom: 16px; }
.ct-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.ct-list-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.ct-icon { font-size: 24px; opacity: 0.7; }
.ct-list-label { font-size: 10px; opacity: 0.6; }
.ct-list-val {
  font-family: var(--font-display);
  font-size: 20px;
  margin-top: 2px;
}

/* RIGHT */
.ct-bot {
  padding: 32px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
  display: flex;
  flex-direction: column;
  min-height: 420px;
}
.ct-bot-eyebrow { font-size: 11px; opacity: 0.7; margin-bottom: 8px; }
.ct-bot-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 40px);
  margin: 0 0 20px;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.ct-bot-feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  overflow-y: auto;
}
.ct-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.45;
}
.ct-msg-bot {
  align-self: flex-start;
  background: color-mix(in srgb, var(--ink) 8%, transparent);
}
.ct-msg-user {
  align-self: flex-end;
  background: var(--accent);
  color: #fff;
}
.ct-busy { font-size: 11px; opacity: 0.5; }

.ct-bot-input { display: flex; gap: 8px; }
.ct-input {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: transparent;
  color: inherit;
  font-family: var(--font-body);
  font-size: 14px;
}
.ct-input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.ct-send { padding: 14px 22px; }
.ct-send:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 720px) {
  .ct-grid { grid-template-columns: 1fr; }
}
</style>
