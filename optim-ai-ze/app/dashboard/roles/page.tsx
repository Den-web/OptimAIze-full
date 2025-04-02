"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, User2, Settings, Briefcase } from "lucide-react"
import { useRoles } from "@/context/role-context"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { DeleteDialog } from "@/components/ui/delete-dialog"

export default function RolesPage() {
  const router = useRouter()
  const { roles, deleteRole } = useRoles()

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id)
      toast({
        title: "Role deleted",
        description: "Your professional role has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "Failed to delete the role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Professional Roles</h1>
            <p className="text-muted-foreground">
              Manage your professional roles to personalize AI responses.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/roles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Role
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{role.name}</span>
                  <Badge variant="outline">{role.category}</Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span>{role.expertise.length} expertise areas</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/dashboard?roleId=${role.id}`}>
                    <User2 className="mr-2 h-4 w-4" />
                    Use in Chat
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/roles/edit/${role.id}`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <DeleteDialog
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete your professional role."
                    onDelete={() => handleDelete(role.id)}
                    buttonClassName="w-full sm:w-auto"
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 