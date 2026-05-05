<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Phaser from 'phaser'
import { probeXlCapability } from '@/composables/useXlCapability'

const container = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  if (prefersReducedMotion()) return
  if (!probeXlCapability().supported) return
  if (!container.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container.value,
    backgroundColor: 'rgba(0,0,0,0)',
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
    },
    fps: { target: 30, forceSetTimeOut: false },
    scene: {
      create(this: Phaser.Scene) {
        const w = this.scale.width
        const h = this.scale.height
        const colors = [0x00ffaa, 0xff00ff, 0xffffff]
        const N = 60
        const shapes: Phaser.GameObjects.Graphics[] = []

        for (let i = 0; i < N; i++) {
          const g = this.add.graphics()
          const c = colors[i % colors.length]
          g.fillStyle(c, 0.55)
          if (i % 3 === 0) {
            g.fillRect(-12, -12, 24, 24)
          } else if (i % 3 === 1) {
            g.fillCircle(0, 0, 10)
          } else {
            g.fillTriangle(-12, 12, 12, 12, 0, -12)
          }
          g.setPosition(Math.random() * w, Math.random() * h)
          g.setData('vx', (Math.random() - 0.5) * 1.6)
          g.setData('vy', (Math.random() - 0.5) * 1.6)
          g.setData('vr', (Math.random() - 0.5) * 0.04)
          shapes.push(g)
        }

        this.events.on('update', (_t: number, _dt: number) => {
          const W = this.scale.width
          const H = this.scale.height
          for (const g of shapes) {
            g.x += g.getData('vx')
            g.y += g.getData('vy')
            g.rotation += g.getData('vr')
            if (g.x < -20) g.x = W + 20
            if (g.x > W + 20) g.x = -20
            if (g.y < -20) g.y = H + 20
            if (g.y > H + 20) g.y = -20
          }
        })
      },
    },
  }

  game = new Phaser.Game(config)
})

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<template>
  <div ref="container" class="xl-chaos" aria-hidden="true"></div>
</template>

<style scoped>
.xl-chaos {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
@media (prefers-reduced-motion: reduce) {
  .xl-chaos { display: none; }
}
</style>
