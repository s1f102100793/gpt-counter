import SettingsIcon from "@mui/icons-material/Settings"
import TimelineIcon from "@mui/icons-material/Timeline"
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material"

interface CustomDrawerProps {
  onSelect: (value: string) => void
}

const CustomDrawer = ({ onSelect }: CustomDrawerProps) => {
  const navItems = [
    { text: "統計", Icon: TimelineIcon, value: "statistics" },
    { text: "全般", Icon: SettingsIcon, value: "general" }
  ]

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map(({ text, Icon, value }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => onSelect(value)}>
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
