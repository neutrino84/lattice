import { ColumnDefinition } from ".."
import ComponentBase from "../components/ComponentBase"

export interface Row {
  component: ComponentBase
  definitions: ColumnDefinition[]
}
