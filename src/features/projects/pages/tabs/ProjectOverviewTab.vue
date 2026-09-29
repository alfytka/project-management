<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import ActivityCard from '../../components/overview/ActivityCard.vue'
import EpicTimeline from '../../components/overview/EpicTimeline.vue'
import OverviewMembersCard from '../../components/overview/OverviewMembersCard.vue'
import OverviewStatCards from '../../components/overview/OverviewStatCards.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'
import { useProjectActivities } from '../../composables/useProjectActivities'
import { useProjectEpics } from '../../composables/useProjectEpics'
import { useProjectTaskStats } from '../../composables/useProjectTaskStats'

const { projectId, project } = useCurrentProject()
const { data: epics } = useProjectEpics(projectId)
const { data: taskStats } = useProjectTaskStats(projectId)
const { data: activities, isPending: activitiesPending } = useProjectActivities(projectId)
</script>

<template>
  <div class="space-y-6">
    <OverviewStatCards v-if="epics && taskStats" :epics="epics" :task-stats="taskStats" />
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="n in 4" :key="n" class="h-36 rounded-2xl" />
    </div>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
      <EpicTimeline v-if="epics" :epics="epics" />
      <Skeleton v-else class="h-96 rounded-2xl" />

      <div class="space-y-6">
        <OverviewMembersCard v-if="project" :project="project" />
        <ActivityCard :activities="activities" :loading="activitiesPending" />
      </div>
    </div>
  </div>
</template>
