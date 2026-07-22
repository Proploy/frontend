import type { SubItemStatus } from './use-workspace-project-detail'

export interface SortableSubItem {
  id: string
  sortOrder?: number | null
  createdAt: string
}

export interface ReorderColumnItem {
  id: string
  status: SubItemStatus
}

export type ReorderColumns = Record<SubItemStatus, ReorderColumnItem[]>

export function sortSubItems<T extends SortableSubItem>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftOrder = typeof left.sortOrder === 'number' ? left.sortOrder : Number.MAX_SAFE_INTEGER
    const rightOrder = typeof right.sortOrder === 'number' ? right.sortOrder : Number.MAX_SAFE_INTEGER
    if (leftOrder !== rightOrder) return leftOrder - rightOrder

    const createdAtDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt)
    if (createdAtDifference !== 0) return createdAtDifference
    return left.id.localeCompare(right.id)
  })
}

export function buildSubItemReorderInput(columns: ReorderColumns) {
  const statuses: SubItemStatus[] = ['open', 'in_progress', 'completed', 'cancelled']
  return {
    items: statuses.flatMap((status) => columns[status].map((item) => ({
      id: item.id,
      status,
    }))),
  }
}
