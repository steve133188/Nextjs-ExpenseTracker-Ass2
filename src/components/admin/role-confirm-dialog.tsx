import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RoleConfirmDialogProps {
  target: { id: string; username: string; newRole: string } | null
  onConfirm: (id: string, role: string) => void
  onCancel: () => void
}

export function RoleConfirmDialog({ target, onConfirm, onCancel }: RoleConfirmDialogProps) {
  return (
    <AlertDialog open={!!target} onOpenChange={(open) => { if (!open) onCancel() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change role?</AlertDialogTitle>
          <AlertDialogDescription>
            Set <strong>{target?.username}</strong> to{" "}
            <strong>{target?.newRole}</strong>. This will change their access level immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { if (target) onConfirm(target.id, target.newRole) }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
