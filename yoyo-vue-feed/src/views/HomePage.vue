<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>News Feed</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="content">
      <ion-page>
        <ion-content>
          <ion-list>
            <ion-item v-for="post in posts" :key="post.id" lines="none">
              <PostItem :post="post" :country="country" />
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-page>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { IPostItem } from '../types';
import PostItem from '../components/posts/PostItem.vue';
import { Geolocation } from '@capacitor/geolocation';

const apiUrl = import.meta.env.VITE_API_URL;
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const country = ref('ko'); //init country code

const posts = reactive<IPostItem[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl}/posts`);
    const data = await response.json();
    posts.push(...data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getCurrentCountry = async () => {
  try {
    // Get the current position
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;

    // Call a reverse geocoding API to get the country
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
    );
    const data = await response.json();

    console.log('Location:', data);

    // Extract the country from the API response
    const address = data.results[0].address_components.find((component) =>
      component.types.includes('country')
    );
    if (address && address?.short_name) {
      country.value = address.short_name.toLowerCase();
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
}

onMounted(() => {
  fetchData();
  getCurrentCountry();
});

</script>
