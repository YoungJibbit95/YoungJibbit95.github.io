import type { CameraBounds, CameraPose, Vec3 } from '../worldTypes'
import type { ObservatoryProject } from './contracts'

export const observatoryBounds: CameraBounds = {
  minDistance: 20,
  maxDistance: 3600,
  box: { x: [-600, 600], y: [-300, 400], z: [-800, 350] },
}

export const observatoryOverview: CameraPose = {
  position: [320, 300, 620],
  target: [0, 0, -220],
  fov: 48,
  zoom: 1,
}
export const observatoryCompactOverview: CameraPose = {
  position: [390, 480, 1160],
  target: [0, 0, -200],
  fov: 48,
  zoom: 1,
}

export function projectPose(
  project: ObservatoryProject,
  compact = false,
  detail = false,
): CameraPose {
  const offset: Vec3 = detail ? [75, 65, 135] : compact ? [95, 90, 210] : [85, 60, 145]
  return {
    position: project.position.map((value, axis) => value + offset[axis]) as unknown as Vec3,
    target: [...project.position],
    fov: 48,
    zoom: 1,
  }
}

/** Fit the actual spatial envelopes, taking the narrow mobile horizontal FOV into account. */
export function fitProjects(projects: readonly ObservatoryProject[], aspect: number): CameraPose {
  if (!projects.length) return aspect < 0.8 ? observatoryCompactOverview : observatoryOverview
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const project of projects) {
    project.position.forEach((value, axis) => {
      min[axis] = Math.min(min[axis], value - project.radius)
      max[axis] = Math.max(max[axis], value + project.radius)
    })
  }
  const center = min.map((value, axis) => (value + max[axis]) / 2) as [number, number, number]
  const radius = Math.hypot(...max.map((value, axis) => (value - min[axis]) / 2))
  const halfFov = Math.atan(Math.tan((24 * Math.PI) / 180) * Math.min(1, Math.max(0.3, aspect)))
  const distance = Math.min(3500, (radius / Math.sin(halfFov)) * 1.05)
  const direction = [0.29, 0.28, 0.915]
  const length = Math.hypot(...direction)
  return {
    position: center.map((value, axis) => value + (direction[axis] / length) * distance) as [
      number,
      number,
      number,
    ],
    target: center,
    fov: 48,
    zoom: 1,
  }
}

export function cameraDistance(pose: CameraPose): number {
  return Math.hypot(...pose.position.map((value, axis) => value - pose.target[axis]))
}
