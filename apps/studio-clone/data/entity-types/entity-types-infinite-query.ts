import { QueryClient, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { executeQuery } from 'lib/api/query'
import { ENTITY_TYPE } from './entity-type-constants'

export type EntityTypesVariables = {
  projectRef?: string
  connectionString?: string | null
  schemas?: string[]
  search?: string
  limit?: number
  page?: number
  sort?: 'alphabetical' | 'grouped-alphabetical'
  filterTypes?: string[]
}

export interface EntitySummary {
  id: number
  schema: string
  name: string
  type: ENTITY_TYPE
  comment: string | null
  rls_enabled: boolean
}

export type EntityTypesResponse = {
  data: {
    entities: EntitySummary[]
    count: number
  }
}

export async function getEntityTypes(
  {
    projectRef,
    connectionString,
    schemas = ['public'],
    search,
    limit = 100,
    page = 0,
    sort = 'alphabetical',
    filterTypes = Object.values(ENTITY_TYPE),
  }: EntityTypesVariables,
  signal?: AbortSignal
): Promise<EntityTypesResponse> {
  const innerOrderBy = sort === 'alphabetical' ? `c.relname asc` : `"type_sort" asc, c.relname asc`
  const outerOrderBy = sort === 'alphabetical' ? `r.name asc` : `r.type_sort asc, r.name asc`

  const sql = /* SQL */ `
    with records as (
      select
        c.oid::int8 as "id",
        nc.nspname as "schema",
        c.relname as "name",
        c.relkind as "type",
        case c.relkind
          when 'r' then 1
          when 'v' then 2
          when 'm' then 3
          when 'f' then 4
          when 'p' then 5
        end as "type_sort",
        obj_description(c.oid) as "comment",
        count(*) over() as "count",
        c.relrowsecurity as "rls_enabled"
      from
        pg_namespace nc
        join pg_class c on nc.oid = c.relnamespace
      where
        c.relkind in (${filterTypes.map((x) => `'${x}'`).join(', ')})
        and not pg_is_other_temp_schema(nc.oid)
        and (
          pg_has_role(c.relowner, 'USAGE')
          or has_table_privilege(
            c.oid,
            'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
          )
          or has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
        )
        and nc.nspname in (${schemas.map((x) => `'${x}'`).join(', ')})
        ${search ? `and c.relname ilike '%${search}%'` : ''}
      order by ${innerOrderBy}
      limit ${limit}
      offset ${page * limit}
    )
    select
      jsonb_build_object(
        'entities', coalesce(jsonb_agg(
          jsonb_build_object(
            'id', r.id,
            'schema', r.schema,
            'name', r.name,
            'type', r.type,
            'comment', r.comment,
            'rls_enabled', r.rls_enabled
          )
          order by ${outerOrderBy}
        ), '[]'::jsonb),
        'count', coalesce(min(r.count), 0)
      ) "data"
    from records r;
  `

  const { data, error } = await executeQuery<EntityTypesResponse>({ query: sql })

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    return {
      data: {
        entities: [],
        count: 0,
      },
    }
  }

  return data[0]
}

export const entityTypeKeys = {
  entityTypes: (
    projectRef: string | undefined,
    { schemas, search, sort, filterTypes }: Partial<EntityTypesVariables>
  ) =>
    ['projects', projectRef, 'entity-types', { schemas, search, sort, filterTypes }].filter(
      Boolean
    ),
}

export const useEntityTypesQuery = <TData = EntityTypesResponse>(
  variables: EntityTypesVariables,
  options?: UseInfiniteQueryOptions<EntityTypesResponse, Error, TData>
) => {
  return useInfiniteQuery<EntityTypesResponse, Error, TData>({
    queryKey: entityTypeKeys.entityTypes(variables.projectRef, variables),
    queryFn: ({ pageParam = 0, signal }) =>
      getEntityTypes({ ...variables, page: pageParam as number }, signal),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.data.count
      const currentCount = allPages.reduce((acc, page) => acc + page.data.entities.length, 0)
      return currentCount < totalCount ? allPages.length : undefined
    },
    ...options,
  })
}
