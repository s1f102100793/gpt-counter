import styles from "./ChangeButton.module.css"

export const ChangeButton = (props: { onClick: () => void }) => {
  return (
    <div className={styles.buttonContainer}>
      <button onClick={() => props.onClick()} className={styles.changeButton}>
        この設定に変更
      </button>
    </div>
  )
}
