import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Sheet, SheetContent } from '../ui/sheet'
import ApperIcon from '../ApperIcon'

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'BarChart3' },
  { name: 'Contacts', href: '/contacts', icon: 'Users' },
  { name: 'Pipeline', href: '/pipeline', icon: 'TrendingUp' },
  { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' }
]

const SidebarContent = () => {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg crm-gradient-bg flex items-center justify-center">
            <ApperIcon name="Building2" className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">RelateHub</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-crm-primary/10 text-crm-primary hover:bg-crm-primary/20' : ''
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Sidebar