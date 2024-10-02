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
              <PostItem :post="post" />
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

const apiUrl = ref(import.meta.env.VITE_API_URL);
const posts = reactive<IPostItem[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl.value}/posts`);
    const data = await response.json();
    posts.push(...data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});

</script>
