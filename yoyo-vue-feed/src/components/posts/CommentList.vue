<template>
    <ion-list>
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </ion-list>
  </template>
  
  <script lang="ts" setup>
  import { ICommentItem } from '../types';
  import CommentItem from './CommentItem.vue';
  
  defineProps<{ comments: ICommentItem[] }>();
  </script>
  