<template>
  <IonCard>
    <ion-card-header>
      <ion-item>
        <img :src="post.authorInfo.avatar" alt="Avatar" class="avatar" />
        <ion-label>
          <h2>{{ post.authorInfo.name }}</h2>
        </ion-label>
      </ion-item>
    </ion-card-header>
    <ion-card-content>
      <h2>{{ post.title }}</h2>
      <div v-html="post.content"></div>

      <div class="translate" @click="handleTranslate(post, country)">translate post</div>
      <div v-show="showTranslated && post?.translatedContent" v-html="post.translatedContent"></div>
      <!-- Comment List -->
      <CommentList :comments="post.comments" :country="country" />
    </ion-card-content>
  </IonCard>
</template>

<script lang="ts" setup>
import { IPostItem } from '../types';
import CommentList from './CommentList.vue';
import { ref } from 'vue';
import { useTranslate } from '../../composables/useTranslate';

const { translate } = useTranslate();  // use composable function

const showTranslated = ref(false);

defineProps<{ post: IPostItem, country: string }>();

const handleTranslate = async (post: IPostItem, country: string) => {
  showTranslated.value = !showTranslated.value;
  if (!post?.translatedContent) {
    await translate(post, post.content, 'en', country); // translate post content
  }
};
</script>

<style scoped>
ion-card-header {
  padding: 10px 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.translate {
  color: rgb(104, 104, 251);
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  margin: 6px 0;
}
</style>