<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>News Feed</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="post in posts" :key="post.id" lines="none" class="content">
          <PostItem :post="post" :country="country" />
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { IPostItem } from '../types';
import PostItem from '../components/posts/PostItem.vue';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@capacitor/storage';

const postsMock = [
  {
    "id": 1,
    "authorInfo": {
      "id": 1,
      "name": "John Doe",
      "avatar": "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
    },
    "title": "Why do we use it?",
    "content": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    "comments": [
      {
        "id": 1,
        "content": "comment1",
        "userInfo": {
          "id": 2,
          "name": "Lisa",
          "avatar": "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
        }
      }
    ]
  },
  {
    "id": 2,
    "authorInfo": {
      "id": 3,
      "name": "Alex Lunk",
      "avatar": "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
    },
    "title": "What is Lorem Ipsum?",
    "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    "comments": [
      {
        "id": 2,
        "content": "comment2",
        "userInfo": {
          "id": 1,
          "name": "John Doe",
          "avatar": "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
        }
      }
    ]
  }
]

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const country = ref('ko'); //init country code

const posts = reactive<IPostItem[]>([]);

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

const savePosts = async (data) => {
  await Storage.set({
    key: 'posts',
    value: JSON.stringify(data),
  });
};

const getPosts = async () => {
  const { value } = await Storage.get({ key: 'posts' });
  return value ? JSON.parse(value) : null;
};


// Save on application startup
onMounted(() => {
  savePosts(postsMock);
});


onMounted(async () => {
  getCurrentCountry();
  const rs = await getPosts();
  if (rs) {
    posts.push(...rs)
  }
});

</script>