"use client"

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Search, ThermometerIcon, Droplets, Power, FireExtinguisher, Calendar, Star, BarChart2, Package, Truck, Bell, Plus, Edit, Trash2, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BarChart, LineChart } from '@tremor/react'

// Simulated API functions
const fetchInventory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Paracetamol", quantity: 200, expiry: "2025-12-31", batch: "Batch A", reorderPriority: "Yes (Low Stock)", usage: 75 },
        { id: 2, name: "Aspirin", quantity: 75, expiry: "2025-06-20", batch: "Batch A", reorderPriority: "Yes (Low Stock)", usage: 90 },
        { id: 3, name: "Amoxicillin", quantity: 500, expiry: "2025-11-10", batch: "Batch C", reorderPriority: "No", usage: 30 },
        { id: 4, name: "Metformin", quantity: 50, expiry: "2024-10-01", batch: "Batch A", reorderPriority: "Yes (Critical)", usage: 95 },
        { id: 5, name: "Losartan", quantity: 600, expiry: "2027-01-15", batch: "Batch B", reorderPriority: "No", usage: 20 },
      ])
    }, 1000)
  })
}

const fetchAlerts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, message: "Paracetamol stock running low", priority: "high" },
        { id: 2, message: "Metformin stock critically low", priority: "critical" },
        { id: 3, message: "Omeprazole stock running low", priority: "medium" },
        { id: 4, message: "Check Losartan expiration dates.", priority: "medium" },
      ])
    }, 500)
  })
}

// Add these interfaces above the component
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  expiry: string;
  batch: string;
  reorderPriority: string;
  usage: number;
}

interface Alert {
  id: number;
  message: string;
  priority: string;
}

export function DashboardComponent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState('staff')
  const [notifications, setNotifications] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const inventoryData = await fetchInventory() as InventoryItem[]
      const alertsData = await fetchAlerts() as Alert[]
      setInventory(inventoryData)
      setAlerts(alertsData)
    }
    fetchData()
  }, [])

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    setInventory([...inventory, { ...newItem, id: inventory.length + 1 }])
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the inventory.`,
    })
  }

  const handleEditItem = (editedItem: InventoryItem) => {
    setInventory(inventory.map(item => item.id === editedItem.id ? editedItem : item))
    toast({
      title: "Item Updated",
      description: `${editedItem.name} has been updated in the inventory.`,
    })
  }

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id))
    toast({
      title: "Item Deleted",
      description: "The item has been removed from the inventory.",
      variant: "destructive",
    })
  }

  const handleLogin = (role: 'staff' | 'admin') => {
    setIsAuthenticated(true)
    setUserRole(role)
    toast({
      title: "Logged In",
      description: `Welcome back, ${role}!`,
    })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('staff')
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please select your role to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button onClick={() => handleLogin('staff')}>Login as Staff</Button>
              <Button onClick={() => handleLogin('admin')}>Login as Admin</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hospital Inventory Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>
                  Your recent notifications
                </DialogDescription>
              </DialogHeader>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index} className="py-2 border-b last:border-b-0">
                      {notification}
                    </li>
                  ))}
                </ul>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventory.filter(item => item.reorderPriority.includes("Yes")).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <li key={alert.id} className="flex items-center space-x-2 p-2 rounded bg-white shadow-sm">
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(alert.priority)}`}></span>
                      <span className="flex-grow">{alert.message}</span>
                      <Badge variant="outline">{alert.priority}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={inventory.slice(0, 5).map(item => ({ name: item.name, value: item.quantity }))}
                  index="name"
                  categories={['value']}
                  colors={['sky']}
                  valueFormatter={(value) => `${value} units`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Inventory Manager</CardTitle>
              {userRole === 'admin' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Item</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
                      const newItem: Omit<InventoryItem, "id"> = {
                        name: formData.name as string,
                        quantity: parseInt(formData.quantity as string, 10),
                        expiry: formData.expiry as string,
                        batch: formData.batch as string,
                        reorderPriority: "No", // Default value
                        usage: 0 // Default value
                      };
                      handleAddItem(newItem);
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name">Name</label>
                          <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="quantity">Quantity</label>
                          <Input id="quantity" name="quantity" type="number" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="expiry">Expiry</label>
                          <Input id="expiry" name="expiry" type="date" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="batch">Batch</label>
                          <Input id="batch" name="batch" className="col-span-3" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Item</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Reorder Priority</TableHead>
                    {userRole === 'admin' && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                
                          <Progress value={item.usage} className="w-[60px]" />
                          <span className="text-sm text-muted-foreground">{item.usage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.reorderPriority.includes("Yes") ? "destructive" : "secondary"}>
                          {item.reorderPriority}
                        </Badge>
                      </TableCell>
                      {userRole === 'admin' && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Item</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget as HTMLFormElement)
                                  const editedItem: InventoryItem = {
                                    id: item.id,
                                    name: formData.get('name') as string,
                                    quantity: parseInt(formData.get('quantity') as string, 10),
                                    expiry: formData.get('expiry') as string,
                                    batch: formData.get('batch') as string,
                                    reorderPriority: item.reorderPriority,
                                    usage: item.usage
                                  };
                                  handleEditItem(editedItem);
                                }}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label htmlFor="edit-name">Name</label>
                                      <Input id="edit-name" name="name" defaultValue={item.name} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label htmlFor="edit-quantity">Quantity</label>
                                      <Input id="edit-quantity" name="quantity" type="number" defaultValue={item.quantity} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label htmlFor="edit-expiry">Expiry</label>
                                      <Input id="edit-expiry" name="expiry" type="date" defaultValue={item.expiry} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <label htmlFor="edit-batch">Batch</label>
                                      <Input id="edit-batch" name="batch" defaultValue={item.batch} className="col-span-3" required />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Save Changes</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Paracetamol</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>2024-10-15</TableCell>
                    <TableCell>MedSupply Co.</TableCell>
                    <TableCell><Badge>Processing</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Amoxicillin</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>2024-10-20</TableCell>
                    <TableCell>PharmaCare Ltd.</TableCell>
                    <TableCell><Badge variant="secondary">Shipped</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Metformin</TableCell>
                    <TableCell>2000</TableCell>
                    <TableCell>2024-11-01</TableCell>
                    <TableCell>DiabetesCare Inc.</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Stock Level Trends</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { date: '2023-01-01', Paracetamol: 200, Aspirin: 100, Metformin: 150 },
                    { date: '2023-02-01', Paracetamol: 250, Aspirin: 120, Metformin: 180 },
                    { date: '2023-03-01', Paracetamol: 180, Aspirin: 200, Metformin: 220 },
                    { date: '2023-04-01', Paracetamol: 280, Aspirin: 250, Metformin: 300 },
                    { date: '2023-05-01', Paracetamol: 220, Aspirin: 180, Metformin: 280 },
                    { date: '2023-06-01', Paracetamol: 300, Aspirin: 220, Metformin: 320 },
                  ]}
                  index="date"
                  categories={['Paracetamol', 'Aspirin', 'Metformin']}
                  colors={['red', 'blue', 'green']}
                  yAxisWidth={40}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Item Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: 'Paracetamol', value: 35 },
                    { name: 'Aspirin', value: 27 },
                    { name: 'Metformin', value: 18 },
                    { name: 'Amoxicillin', value: 15 },
                    { name: 'Losartan', value: 5 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['teal']}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
