import { createRouter, createWebHistory } from 'vue-router'
import NotFound from "@/components/NotFound/NotFound.vue";
import CoursePage from "@/views/course/CoursePage.vue";
import EditChapterPage from "@/views/chapter/EditChapterPage.vue";
import AddChapterPage from "@/views/chapter/AddChapterPage.vue";
import SortChapterPage from "@/views/chapter/SortChapterPage.vue";
import CourseUpdateForm from "@/views/course/CourseUpdateForm.vue";
import LessonsPage from "@/views/lesson/LessonsPage.vue";
import ChapterPage from "@/views/chapter/ChapterPage.vue";
import AddLessonPage from '@/views/lesson/AddLessonPage.vue';
import SortLessonPage from '@/views/lesson/SortLessonPage.vue'

const routes = [
  {
    path: "/",
    name: "CoursePage",
    component: CoursePage,
  },
  {
    path: "/chapters",
    name: "ChapterPage",
    component: ChapterPage,
    props: true,
  },
  {
    path: "/edit-chapter/:id",
    name: "EditChapterPage",
    component: EditChapterPage,
  },
  {
    path: "/add-chapter",
    name: "AddChapterPage",
    component: AddChapterPage,
  },
  {
    path: "/sort-chapter",
    name: "SortChapterPage",
    component: SortChapterPage,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/courses-update/:id/",
    name: "CourseUpdateForm",
    component: CourseUpdateForm,
    props: true,
  },
  {
    path: "/courses-create",
    name: "CourseCreateForm",
    component: CourseUpdateForm,
    props: true,
  },
  {
    path: "/lessons",
    name: "LessonsPage",
    component: LessonsPage,
    props: true
  },
  {
    path: '/add-lessons',
    name: "AddLessonPage",
    component: AddLessonPage,
    props: true
  },
  {
    path: '/lessons-update/:id/',
    name: 'UpdateLessonPage',
    component: AddLessonPage,
    props: true
  },
  {
    path: "/sort-lessons",
    name: "SortLessonPage",
    component: SortLessonPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


export default router
