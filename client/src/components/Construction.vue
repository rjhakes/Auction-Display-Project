<template>
    <main class="construction">
      <router-link v-bind:to="{ name: 'Admin' }">
        <button class="construction-button"><span class="button-arrow">&#8592;</span> Return to Dashboard</button>
      </router-link>
      <img class="construction__image" src='../assets/Under_Construction.gif' alt="Webpage Under Construction">
    </main>
</template>
