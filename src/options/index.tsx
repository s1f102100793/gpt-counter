import { Box, CssBaseline, Drawer, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import CustomDrawer from "src/components/CustomDrawer"

const drawerWidth = 240

function OptionsIndex() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState("statistics")

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSelectItem = (value: string) => {
    setSelectedItem(value)
  }

  const renderContent = () => {
    switch (selectedItem) {
      case "statistics":
        return <Typography>統計の内容</Typography>
      case "general":
        return <Typography>全般の内容</Typography>
      default:
        return <Typography>選択された項目がありません</Typography>
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}>
          <CustomDrawer onSelect={handleSelectItem} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open>
          <CustomDrawer onSelect={handleSelectItem} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  )
}

export default OptionsIndex
