# Create Workflow Wireframe

## Page Overview
- **Title**: "Create Workflow"
- **Breadcrumb**: Home > Workflows > Create Workflow

## Layout
| Area | Description |
|------|-------------|
| **Header** | Page title and back button |
| **Steps List** | Table / list showing existing steps. Columns: #, Step Name, Step Type, Max Amount, Actions (Edit, Delete, Move). |
| **Add Step Button** | Bottom of steps list or floating action button (FAB) |
| **Add Step Modal** | Opens when **Add Step** is clicked. Contains: |
| &nbsp;&nbsp;• Step Name (text input, required) |
| &nbsp;&nbsp;• Step Type (dropdown) |
| &nbsp;&nbsp;• Max Amount (optional numeric input) |
| &nbsp;&nbsp;• Submit / Cancel buttons |
| **Save Workflow** | Top‑right button to finalize and persist the workflow |

## Component Hierarchy (React/TSX)
- `CreateWorkflowPage` (container)
  - `Header`
  - `StepsList` (list of `WorkflowStepCard`)
    - `WorkflowStepCard`
      - `StepNameInput`
      - `StepTypeSelect`
      - `MaxAmountInput` (optional)
      - `ActionsMenu` (edit / delete)
  - `AddStepButton` (FAB)
  - `AddStepModal` (controlled form)
  - `SaveWorkflowButton` (top‑right)

## Interaction Flow
1. Click **Add Step** → **AddStepModal** opens.  
2. Fill step details → click **Submit** → step added to list.  
3. Edit a step via **Edit** in actions menu or click the step row to modify.  
4. Delete a step using **Delete**.  
5. When configuration is complete, click **Save Workflow** → backend validates and stores the workflow.

## Sample UI Mockup (ASCII)

```
+-----------------------------------------------------------+
|  [Back]   Create Workflow                               X |
+-----------------------------------------------------------+
|  Step 1:  [Name]   [Type ▼]   [Max Amount $]   [Edit] [Del]|
|  Step 2:  [Name]   [Type ▼]   [Max Amount $]   [Edit] [Del]|
|  ...                                                   |
+-----------------------------------------------------------+
|  [Add Step]                                           [Save]|
+-----------------------------------------------------------+

+-----------------------------------------------------------+
|                +----------------------------+          |
|  Add Step      |  Step Name: [________________]   |  Cancel |
|                |  Step Type: [Dropdown ▼]        |         |
|                |  Max Amount: [________________] |         |
|                |  [Submit]  [Cancel]                |         |
|                +----------------------------+          |
+-----------------------------------------------------------+
```

## Notes
- All inputs validate in real‑time.
- `Max Amount` is optional; when present must be ≥ 0 and can show a currency symbol.
- Steps maintain order; moving up/down may be supported via drag‑and‑drop or up/down arrows.
- The workflow must reference an existing `WorkflowDefinitionId`; the backend validates that the definition exists before persisting steps.