import { Box, CssBaseline, Drawer, Toolbar } from "@mui/material"
import { useState } from "react"
import CustomDrawer from "src/components/CustomDrawer"
import OptionsContent from "src/components/OptionsContent"

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
          <CustomDrawer
            onSelect={handleSelectItem}
            selectedValue={selectedItem}
          />
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
          <CustomDrawer
            onSelect={handleSelectItem}
            selectedValue={selectedItem}
          />
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
        <OptionsContent selectedItem={selectedItem} />
      </Box>
    </Box>
  )
}

export default OptionsIndex
