export const alertUtils = {
  changeSetting: async () => {
    return confirm("設定を変更しますか？")
  },
  changeSettingToCannotChangeDifficulty: async () => {
    return confirm("変更すると本日は変更できませんが変更しますか")
  },
  cannotChangeDifficulty: async () => {
    alert("本日は質問しているため、設定を変更できません")
  }
}
