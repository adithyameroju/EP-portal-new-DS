import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"

const workflowSteps = ["Fill data", "Calculate premium", "Preview & submit"]

export function WorkflowSteps({ currentStep }: { currentStep: number }) {
  return (
    <ItemGroup className="flex-row flex-wrap gap-2">
      {workflowSteps.map((step, index) => {
        const stepNumber = index + 1
        const isCurrent = stepNumber === currentStep
        const isComplete = stepNumber < currentStep

        return (
          <Item
            key={step}
            variant={isCurrent ? "muted" : "outline"}
            size="xs"
            className="w-auto"
          >
            <ItemMedia>
              <Badge variant={isCurrent || isComplete ? "default" : "outline"}>
                {stepNumber}
              </Badge>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{step}</ItemTitle>
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
