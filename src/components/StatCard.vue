<script setup lang="ts">
defineProps<{
    label: string
    value: string | number
    icon: string
    iconBg?: string
    iconColor?: string
}>()
</script>

<template>
    <div
        class="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-between hover:shadow-lg transition-shadow">
        <div class="flex flex-row w-full items-center">
            <div class="flex justify-center items-center h-fit p-2 mr-2 rounded-xl" :class="iconBg || 'bg-blue-100'">
                <iconify-icon :icon="icon" width="14" :class="iconColor || 'text-blue-600'" />
            </div>
            <p class="text-sm flex items-center text-gray-500">{{ label }}</p>

        </div>
        <div class="text-left w-full mt-2">
            <p class="text-3xl font-semibold">{{ value }}</p>
        </div>
    </div>
</template>
