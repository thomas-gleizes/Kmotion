import { Button } from "@/shared/ui/Button"
import { pager } from "@/features/admin/admin.styles"

export function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  return (
    <div className={pager}>
      <Button variant="ghost" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Précédent
      </Button>
      <span>
        Page {page + 1} / {totalPages}
      </span>
      <Button variant="ghost" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
        Suivant
      </Button>
    </div>
  )
}
