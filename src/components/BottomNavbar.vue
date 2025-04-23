<script lang="ts"></script>
<template>
    <nav class="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t shadow-md py-2">
        <RouterLink to="/dashboard" class="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <iconify-icon icon="mdi:home" width="24" />
            <span class="text-xs">Start</span>
        </RouterLink>

        <RouterLink to="/routes" class="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <iconify-icon icon="mdi:map" width="24" />
            <span class="text-xs">Trasy</span>
        </RouterLink>

        <RouterLink to="/trackview" class="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <iconify-icon icon="mdi:bike" width="24" />
            <span class="text-xs">Dodaj</span>
        </RouterLink>

        <RouterLink to="/profile" class="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <iconify-icon icon="mdi:account" width="24" />
            <span class="text-xs">Profil</span>
        </RouterLink>
    </nav>
</template>
