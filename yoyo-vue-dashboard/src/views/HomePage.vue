<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Admin Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="content">
      <ion-grid class="grid">
        <ion-row class="header">
          <ion-col>Image</ion-col>
          <ion-col>Title</ion-col>
          <ion-col>Status (Approved)</ion-col>
        </ion-row>

        <ion-row v-for="(item) in posts" :key="item.id">
          <ion-col><img :src="item.image" alt="image"></ion-col>
          <ion-col>{{ item.title }}</ion-col>
          <ion-col>
            <div>
              <div v-if="item.status === Status.OPEN" @click="startChangeStatus(item)">open</div>
              <div v-else> <ion-toggle :checked="item.status === Status.APPROVED"
                  @ionChange="(event) => updateStatus(event, item)" /></div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonToggle } from '@ionic/vue';

enum Status {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface IPostItem {
  id: number;
  image: string;
  title: string
  status: Status;
}

const apiUrl = ref(import.meta.env.VITE_API_URL);
const posts = reactive<IPostItem[]>([]);

const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl.value}/items`);
    const data = await response.json();
    posts.push(...data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData(); // Get data when component is mounted
});

const handleChangePosts = async (item: IPostItem, status?: Status) => {
  try {
    const response = await fetch(`${apiUrl.value}/items/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...item, status: status ? status : Status.APPROVED })
    });

    if (response.ok) {
      const newPost = await response.json();
      const newPosts: IPostItem[] = posts.map((post) => {
      if (post.id === item.id) {
        return { ...newPost };
      }
      return post;
    });
    posts.splice(0, posts.length, ...newPosts);
    } else {
      console.error('Error updating status');
    }
  } catch (error) {
    console.error('Error calling API:', error);
  }
};

// start change status open -> approved
const startChangeStatus = async (item: IPostItem) => {
  handleChangePosts(item);
}

// update status when toggle is changed
const updateStatus = async (event: CustomEvent, item: IPostItem) => {
  const newStatus = event.detail.checked ? Status.APPROVED : Status.REJECTED;
  handleChangePosts(item, newStatus);
};

</script>

<style scoped>
ion-content {
  padding: 100px;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 2px;
}

ion-col {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  font-weight: bold;
}
</style>
