/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/dashboard/': RouteRecordInfo<'/dashboard/', '/dashboard', Record<never, never>, Record<never, never>>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/profile/': RouteRecordInfo<'/profile/', '/profile', Record<never, never>, Record<never, never>>,
    '/routes/': RouteRecordInfo<'/routes/', '/routes', Record<never, never>, Record<never, never>>,
    '/routes/[id]': RouteRecordInfo<'/routes/[id]', '/routes/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/signup/': RouteRecordInfo<'/signup/', '/signup', Record<never, never>, Record<never, never>>,
    '/trackview/': RouteRecordInfo<'/trackview/', '/trackview', Record<never, never>, Record<never, never>>,
    '/trackview/success/[routeId]': RouteRecordInfo<'/trackview/success/[routeId]', '/trackview/success/:routeId', { routeId: ParamValue<true> }, { routeId: ParamValue<false> }>,
  }
}
