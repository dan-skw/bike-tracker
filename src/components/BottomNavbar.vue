<script lang="ts"></script>
<template>
  <nav
    class="fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t bg-white py-2 shadow-md"
  >
    <RouterLink
      to="/dashboard"
      class="flex flex-col items-center text-gray-600 hover:text-blue-600"
      exact-active-class="text-primary border-b-2 border-primary"
    >
      <iconify-icon icon="mdi:home" width="24" />
      <span class="text-xs">Start</span>
    </RouterLink>

    <RouterLink
      to="/routes"
      class="flex flex-col items-center text-gray-600 hover:text-blue-600"
      exact-active-class="text-primary border-b-2 border-primary"
    >
      <iconify-icon icon="mdi:map" width="24" />
      <span class="text-xs">Trasy</span>
    </RouterLink>

    <RouterLink
      to="/trackview"
      class="flex flex-col items-center text-gray-600 hover:text-blue-600"
      exact-active-class="text-primary border-b-2 border-primary"
    >
      <iconify-icon icon="mdi:bike" width="24" />
      <span class="text-xs">Dodaj</span>
    </RouterLink>

    <RouterLink
      to="/profile"
      class="flex flex-col items-center text-gray-600 hover:text-blue-600"
      exact-active-class="text-primary border-b-2 border-primary"
    >
      <iconify-icon icon="mdi:account" width="24" />
      <span class="text-xs">Profil</span>
    </RouterLink>
  </nav>
</template>
