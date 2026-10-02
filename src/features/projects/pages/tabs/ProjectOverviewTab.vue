<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectEpics } from '@/features/epics/composables/useProjectEpics'
import ActivityCard from '../../components/overview/ActivityCard.vue'
import EpicTimeline from '../../components/overview/EpicTimeline.vue'
import OverviewMembersCard from '../../components/overview/OverviewMembersCard.vue'
import OverviewStatCards from '../../components/overview/OverviewStatCards.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'
import { useProjectActivities } from '../../composables/useProjectActivities'

const { projectId, project } = useCurrentProject()
const { data: epics } = useProjectEpics(projectId)
const { data: activities, isPending: activitiesPending } = useProjectActivities(projectId)
</script>

<template>
  <div class="space-y-4">
    <OverviewStatCards v-if="epics" :epics="epics" />
    <div v-else class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Skeleton v-for="n in 4" :key="n" class="h-36 rounded-2xl" />
    </div>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
      <EpicTimeline v-if="epics" :project-id="projectId" :epics="epics" />
      <Skeleton v-else class="h-96 rounded-2xl" />

      <div class="space-y-4">
        <OverviewMembersCard v-if="project" :project="project" />
        <ActivityCard :activities="activities" :loading="activitiesPending" />
      </div>
    </div>
  </div>
</template>
