import { Button } from '../ui/button'
import { Input } from '../ui/input'
import ApperIcon from '../ApperIcon'
import { useTheme } from 'next-themes'

const Header = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="relative hidden md:block">
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              size={16} 
            />
            <Input
              placeholder="Search contacts, opportunities..."
              className="pl-10 w-64 lg:w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <ApperIcon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={16} />
          </Button>
          
          <div className="h-8 w-8 rounded-full bg-crm-primary flex items-center justify-center">
            <span className="text-sm font-medium text-white">AJ</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header