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
  selectedValue: string
}

const CustomDrawer = ({ onSelect, selectedValue }: CustomDrawerProps) => {
  const navItems = [
    { text: "統計", Icon: TimelineIcon, value: "statistics" },
    { text: "全般", Icon: SettingsIcon, value: "general" }
  ]

  return (
    <div style={{ backgroundColor: "#f1f1f1", minHeight: "100vh" }}>
      <Toolbar />
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
