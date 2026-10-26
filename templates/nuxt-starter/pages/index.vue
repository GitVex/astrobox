<!-- A mechanical screen: set the voice once, on the outermost element. -->
<template>
  <main data-voice="mechanical" style="max-width:960px;margin:0 auto;padding:32px 16px;display:grid;gap:24px">
    <header>
      <span class="lbl b">Datapad · Ship</span>
      <h1 style="font:600 40px/1 var(--fb);letter-spacing:-.04em;margin:6px 0 0">Long Patience</h1>
    </header>

    <div class="xf"><i class="pl tl" /><i class="pl tr" /><i class="pl bl" /><i class="pl br" />
      <div class="xf-h"><span class="xf-t">Ship status</span></div>
      <div class="xf-b" style="display:grid;gap:12px">
        <div class="meter">
          <div class="mh">
            <b>Hull points</b>
            <!-- Astrobox owns the contents of units and meters: render them once, then update with $astrobox.count -->
            <span><data ref="hull" class="u" data-kind="pool" value="14" data-max="20">14/20</data></span>
          </div>
          <div ref="cells" class="cells ok" style="--n:20" data-f="14" />
        </div>
        <div><button class="btn pri" type="button" @click="damage">Take 2 damage</button></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
let hull = 14 // app state; Astrobox only displays it
const hullEl = useTemplateRef<HTMLElement>('hull')
const cellsEl = useTemplateRef<HTMLElement>('cells')
const { $astrobox } = useNuxtApp()

function damage() {
  hull = Math.max(0, hull - 2)
  $astrobox.count(hullEl.value, hull)
  $astrobox.count(cellsEl.value, hull)
}
</script>
