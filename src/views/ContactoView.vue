<script setup lang="ts"></script>

<template>
  <section class="page">
    <header class="page-head">
      <p class="mono upper page-eyebrow">SIZE / Contacto</p>
      <h1 class="page-title">
        <span class="serif page-italic">Conversemos.</span>
      </h1>
    </header>

    <div class="grid">
      <aside class="card channels">
        <h2 class="mono upper card-label">Canales directos</h2>
        <ul class="channel-list">
          <li><span class="mono channel-key">Instagram</span> @TBD</li>
          <li><span class="mono channel-key">WhatsApp</span> +593 TBD</li>
          <li><span class="mono channel-key">Email</span> TBD@size.ec</li>
          <li><span class="mono channel-key">Facebook</span> TBD</li>
        </ul>
      </aside>

      <div class="card chat">
        <h2 class="mono upper card-label">Chat</h2>
        <p class="chat-copy">
          El chatbot está pendiente de provider. Mientras tanto, escríbenos por WhatsApp o email — respondemos rápido.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12vh 6vw 12vh;
}

.page-head {
  margin-bottom: 80px;
}

.page-eyebrow {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 16px;
}

.page-title {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(56px, 9vw, 144px);
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 0;
}

.page-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
}

.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 2fr 3fr;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  border: 1px solid var(--line);
  padding: 32px;
}

.card-label {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 24px;
}

.channel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
  font-family: var(--font-body);
  font-size: 16px;
}

.channel-key {
  display: inline-block;
  width: 96px;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.08em;
}

.chat-copy {
  font-family: var(--font-body);
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.5;
  color: color-mix(in srgb, var(--ink) 80%, transparent);
  margin: 0;
}
</style>
