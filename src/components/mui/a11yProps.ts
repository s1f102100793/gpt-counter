export function a11yProps(index: number) {
  return {
    id: `limit-setting-tab-${index}`,
    "aria-controls": `limit-setting-tabpanel-${index}`
  }
}
