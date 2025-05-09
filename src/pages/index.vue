<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="min-h-screen bg-[#F2F0EF] flex flex-col items-center justify-center text-center p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6 animate-fade-in">
      <div class="text-5xl">🚴‍♂️</div>
      <h1 class="text-3xl font-bold text-gray-800">Witaj w <span class="text-gray-600">Rowerniku</span></h1>
      <p class="text-gray-600">
        Twój niezawodny kompan rowerowych wojaży — śledź trasy, bij rekordy i odkrywaj nowe miejsca.
      </p>

      <RouterLink to="/login"
        class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition">
        Rozpocznij przygodę
      </RouterLink>
    </div>

    <p class="mt-8 text-sm text-gray-400">© {{ new Date().getFullYear() }} Rowernik</p>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}
</style>
