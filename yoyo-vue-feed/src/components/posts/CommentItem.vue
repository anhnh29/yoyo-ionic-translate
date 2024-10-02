<template>
  <ion-item>
    <img :src="comment.userInfo.avatar" alt="Avatar" class="avatar" />
    <ion-label>
      <h4>{{ comment.userInfo.name }}</h4>
      <div v-html="comment.content"></div>
      <div class="translate" @click="handleTranslate(comment, country)">translate comment</div>
      <div v-show="showTranslated && comment?.translatedContent" v-html="comment.translatedContent"></div>
    </ion-label>
  </ion-item>
</template>

<script lang="ts" setup>
import { ICommentItem } from '../types';
import { ref } from 'vue';
import { useTranslate } from '../../composables/useTranslate';

const { translate } = useTranslate();  // use composable function

const showTranslated = ref(false);

defineProps<{ comment: ICommentItem, country: string }>();

const handleTranslate = async (comment: ICommentItem, country: string) => {
  showTranslated.value = !showTranslated.value;
  if (!comment?.translatedContent) {
    await translate(comment, comment.content, 'en', country);  // translate post comment
  }
};
</script>

<style scoped>
ion-item {
  align-items: start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 10px;
}

.translate {
  color: rgb(104, 104, 251);
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  margin: 6px 0;
}
</style>