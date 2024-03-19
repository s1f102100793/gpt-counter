import SettingsIcon from "@mui/icons-material/Settings"
import TimelineIcon from "@mui/icons-material/Timeline"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material"
import settingIcon from "data-base64:~/assets/settingIcon.png"

interface CustomDrawerProps {
  onSelect: (value: string) => void
  selectedValue: string
}

const CustomDrawer = ({ onSelect, selectedValue }: CustomDrawerProps) => {
  const navItems = [
    { text: "統計", Icon: TimelineIcon, value: "statistics" },
    { text: "全般", Icon: SettingsIcon, value: "general" }
  ]

  return (
    <div style={{ backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
      <Toolbar style={{ gap: "16px", height: "96px" }}>
        <img src={settingIcon} style={{ width: "56px" }} />
        <Typography variant="h6" component="div" sx={{ fontSize: "24px" }}>
          GPT-Counter
        </Typography>
      </Toolbar>
      <List>
        {navItems.map(({ text, Icon, value }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => onSelect(value)}
              sx={{
                backgroundColor:
                  value === selectedValue ? "#ffffff" : "inherit",
                "&:hover": {
                  backgroundColor: value === selectedValue ? "#ffffff" : ""
                }
              }}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default CustomDrawer
