<script setup lang="ts">
const team = [
  { name: 'Javier Ricaurte', role: 'Administración y Estrategia' },
  { name: 'Melissa Gaitán', role: 'Creatividad y Estrategia' },
  { name: 'Rafael Matovelle', role: 'Tecnología y Estrategia' },
  { name: 'Ismael Guerra', role: 'Tecnología y Creatividad' }
]

const clients = [
  { slug: 'mma-el-valle', name: 'MMA El Valle' },
  { slug: 'cranial-trading', name: 'Cranial Trading' },
  { slug: 'sin-cero', name: 'Sin-Cero' }
]
</script>

<template>
  <section class="page">
    <header class="page-head">
      <p class="mono upper page-eyebrow">SIZE / Quiénes somos</p>
      <h1 class="page-title">
        Pequeños en <span class="serif page-italic">tamaño</span>, grandes en alcance.
      </h1>
    </header>

    <section class="block">
      <h2 class="mono upper block-label">Equipo</h2>
      <ul class="team">
        <li v-for="member in team" :key="member.name" class="member">
          <div class="member-photo" aria-hidden="true" />
          <p class="member-name">{{ member.name }}</p>
          <p class="member-role mono upper">{{ member.role }}</p>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2 class="mono upper block-label">Clientes</h2>
      <ul class="clients">
        <li v-for="client in clients" :key="client.slug">
          <RouterLink :to="{ name: 'cliente', params: { slug: client.slug } }" class="client">
            <span class="client-name">{{ client.name }}</span>
            <span aria-hidden="true" class="mono client-arrow">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12vh 6vw 12vh;
}

.page-head {
  margin-bottom: 96px;
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
  max-width: 20ch;
}

.page-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

.block {
  margin-top: 80px;
}

.block-label {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 24px;
}

.team {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.member-photo {
  aspect-ratio: 4 / 5;
  background: color-mix(in srgb, var(--ink) 8%, transparent);
  border: 1px solid var(--line);
  margin-bottom: 16px;
}

.member-name {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 17px;
  margin: 0 0 4px;
}

.member-role {
  font-size: 10px;
  color: var(--muted);
  margin: 0;
}

.clients {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.client {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
  transition: padding-left 220ms ease;
}

.client:hover {
  padding-left: 12px;
}

.client-name {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(20px, 2.4vw, 32px);
  letter-spacing: -0.015em;
}

.client-arrow {
  font-size: 14px;
  color: var(--muted);
}
</style>
