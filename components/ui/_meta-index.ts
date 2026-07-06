/**
 * Compass meta index — re-exports all 55 ComponentMeta objects and provides
 * a name-keyed registry. Consumers: Storybook docs (S2), compliance audit
 * C2/C3/C4 (S4), migration resolution (S5), scaffold pipeline (S6).
 * Generated S1, 2026-07-06.
 */

import type { ComponentMeta } from "./_meta-schema"

import { accordionMeta } from "./accordion.meta"
import { alertMeta } from "./alert.meta"
import { alertDialogMeta } from "./alert-dialog.meta"
import { aspectRatioMeta } from "./aspect-ratio.meta"
import { avatarMeta } from "./avatar.meta"
import { badgeMeta } from "./badge.meta"
import { breadcrumbMeta } from "./breadcrumb.meta"
import { buttonMeta } from "./button.meta"
import { buttonGroupMeta } from "./button-group.meta"
import { calendarMeta } from "./calendar.meta"
import { cardMeta } from "./card.meta"
import { carouselMeta } from "./carousel.meta"
import { chartMeta } from "./chart.meta"
import { checkboxMeta } from "./checkbox.meta"
import { collapsibleMeta } from "./collapsible.meta"
import { comboboxMeta } from "./combobox.meta"
import { commandMeta } from "./command.meta"
import { contextMenuMeta } from "./context-menu.meta"
import { dialogMeta } from "./dialog.meta"
import { directionMeta } from "./direction.meta"
import { drawerMeta } from "./drawer.meta"
import { dropdownMenuMeta } from "./dropdown-menu.meta"
import { emptyMeta } from "./empty.meta"
import { fieldMeta } from "./field.meta"
import { hoverCardMeta } from "./hover-card.meta"
import { inputMeta } from "./input.meta"
import { inputGroupMeta } from "./input-group.meta"
import { inputOtpMeta } from "./input-otp.meta"
import { itemMeta } from "./item.meta"
import { kbdMeta } from "./kbd.meta"
import { labelMeta } from "./label.meta"
import { menubarMeta } from "./menubar.meta"
import { nativeSelectMeta } from "./native-select.meta"
import { navigationMenuMeta } from "./navigation-menu.meta"
import { paginationMeta } from "./pagination.meta"
import { popoverMeta } from "./popover.meta"
import { progressMeta } from "./progress.meta"
import { radioGroupMeta } from "./radio-group.meta"
import { resizableMeta } from "./resizable.meta"
import { scrollAreaMeta } from "./scroll-area.meta"
import { selectMeta } from "./select.meta"
import { separatorMeta } from "./separator.meta"
import { sheetMeta } from "./sheet.meta"
import { sidebarMeta } from "./sidebar.meta"
import { skeletonMeta } from "./skeleton.meta"
import { sliderMeta } from "./slider.meta"
import { sonnerMeta } from "./sonner.meta"
import { spinnerMeta } from "./spinner.meta"
import { switchMeta } from "./switch.meta"
import { tableMeta } from "./table.meta"
import { tabsMeta } from "./tabs.meta"
import { textareaMeta } from "./textarea.meta"
import { toggleMeta } from "./toggle.meta"
import { toggleGroupMeta } from "./toggle-group.meta"
import { tooltipMeta } from "./tooltip.meta"

export type { ComponentMeta } from "./_meta-schema"
export type {
  AiHints,
  AntiPattern,
  CodeConnectStatus,
  ComponentCategory,
  SpecStatus,
  VariantAxis,
} from "./_meta-schema"

export {
  accordionMeta,
  alertMeta,
  alertDialogMeta,
  aspectRatioMeta,
  avatarMeta,
  badgeMeta,
  breadcrumbMeta,
  buttonMeta,
  buttonGroupMeta,
  calendarMeta,
  cardMeta,
  carouselMeta,
  chartMeta,
  checkboxMeta,
  collapsibleMeta,
  comboboxMeta,
  commandMeta,
  contextMenuMeta,
  dialogMeta,
  directionMeta,
  drawerMeta,
  dropdownMenuMeta,
  emptyMeta,
  fieldMeta,
  hoverCardMeta,
  inputMeta,
  inputGroupMeta,
  inputOtpMeta,
  itemMeta,
  kbdMeta,
  labelMeta,
  menubarMeta,
  nativeSelectMeta,
  navigationMenuMeta,
  paginationMeta,
  popoverMeta,
  progressMeta,
  radioGroupMeta,
  resizableMeta,
  scrollAreaMeta,
  selectMeta,
  separatorMeta,
  sheetMeta,
  sidebarMeta,
  skeletonMeta,
  sliderMeta,
  sonnerMeta,
  spinnerMeta,
  switchMeta,
  tableMeta,
  tabsMeta,
  textareaMeta,
  toggleMeta,
  toggleGroupMeta,
  tooltipMeta,
}

/** All 55 metas, keyed by kebab-case component name. */
export const componentMetaIndex: Record<string, ComponentMeta> = {
  accordion: accordionMeta,
  alert: alertMeta,
  "alert-dialog": alertDialogMeta,
  "aspect-ratio": aspectRatioMeta,
  avatar: avatarMeta,
  badge: badgeMeta,
  breadcrumb: breadcrumbMeta,
  button: buttonMeta,
  "button-group": buttonGroupMeta,
  calendar: calendarMeta,
  card: cardMeta,
  carousel: carouselMeta,
  chart: chartMeta,
  checkbox: checkboxMeta,
  collapsible: collapsibleMeta,
  combobox: comboboxMeta,
  command: commandMeta,
  "context-menu": contextMenuMeta,
  dialog: dialogMeta,
  direction: directionMeta,
  drawer: drawerMeta,
  "dropdown-menu": dropdownMenuMeta,
  empty: emptyMeta,
  field: fieldMeta,
  "hover-card": hoverCardMeta,
  input: inputMeta,
  "input-group": inputGroupMeta,
  "input-otp": inputOtpMeta,
  item: itemMeta,
  kbd: kbdMeta,
  label: labelMeta,
  menubar: menubarMeta,
  "native-select": nativeSelectMeta,
  "navigation-menu": navigationMenuMeta,
  pagination: paginationMeta,
  popover: popoverMeta,
  progress: progressMeta,
  "radio-group": radioGroupMeta,
  resizable: resizableMeta,
  "scroll-area": scrollAreaMeta,
  select: selectMeta,
  separator: separatorMeta,
  sheet: sheetMeta,
  sidebar: sidebarMeta,
  skeleton: skeletonMeta,
  slider: sliderMeta,
  sonner: sonnerMeta,
  spinner: spinnerMeta,
  switch: switchMeta,
  table: tableMeta,
  tabs: tabsMeta,
  textarea: textareaMeta,
  toggle: toggleMeta,
  "toggle-group": toggleGroupMeta,
  tooltip: tooltipMeta,
}

/** All 55 metas as an array (stable, name-sorted). */
export const allComponentMeta: ComponentMeta[] = Object.values(componentMetaIndex)
