<script setup lang="ts">
const services = [
  'Estrategia de Marca y Comunicación',
  'Branding & Identidad',
  'Diseño & Contenido Visual',
  'Producción Audiovisual',
  'Desarrollo Web & Software a Medida',
  'Performance & Paid Media',
  'Social Media & Community',
  'Activaciones de Marca & Eventos',
  'SEO & SEM',
  'IA Aplicada & Automatización',
  'Capacitaciones IA'
]
</script>

<template>
  <section class="page">
    <header class="page-head">
      <p class="mono upper page-eyebrow">SIZE / Servicios</p>
      <h1 class="page-title">
        Once <span class="serif page-italic">disciplinas</span>, una sola promesa.
      </h1>
    </header>
    <ol class="services">
      <li v-for="(service, i) in services" :key="service" class="service">
        <span class="mono service-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="service-name">{{ service }}</span>
      </li>
    </ol>
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
  font-size: clamp(36px, 5vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0;
  max-width: 18ch;
}

.page-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

.services {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.service {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 24px;
  align-items: baseline;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
  transition: padding-left 220ms ease;
}

.service:hover {
  padding-left: 12px;
}

.service-num {
  font-size: 11px;
  color: var(--muted);
}

.service-name {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(18px, 2vw, 26px);
  letter-spacing: -0.01em;
}
</style>
