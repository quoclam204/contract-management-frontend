# Use Cases for Approval Flow Configuration

## 1. CreateWorkflowDefinitionCommand

**Actor**: System / Developer (command issuer)  

**System**: Application Layer (Mediator/Handler)  

**Preconditions**:
- Command contains a non‑empty `Name` and `Description`.
- Command contains a list of `WorkflowStepDto` objects.
- Each step DTO includes required fields: `Name`, `Type`.
- Optional `MaxAmount` field must be a non‑negative number if provided.

**Trigger**: User executes the `CreateWorkflowDefinitionCommand`.

**Main Flow**:
1. Validate the command DTO (required fields, amount condition validation).  
2. Map the DTO to a `WorkflowDefinition` aggregate with associated `WorkflowStep` entities.  
3. Persist the aggregate using the `IWorkflowRepository` (EF Core) ensuring the schema matches `database.sql`.  
4. Return a success response containing the new `WorkflowDefinitionId`.

**Postconditions**:
- A new workflow definition exists in the database.  
- All associated steps are persisted with their amount conditions.  
- The UI can now display and edit the workflow.

## 2. AddWorkflowStepCommand

**Actor**: System / Developer (command issuer)  

**System**: Application Layer (Mediator/Handler)  

**Preconditions**:
- WorkflowDefinition identified by `WorkflowDefinitionId` exists.  
- Command contains a `WorkflowStepDto` with required fields: `Name`, `Type`.  
- Optional `MaxAmount` must be a non‑negative number if supplied.

**Trigger**: User executes the `AddWorkflowStepCommand`.

**Main Flow**:
1. Validate the command DTO.  
2. Load the existing `WorkflowDefinition` from the repository.  
3. Create a `WorkflowStep` entity from the DTO.  
4. Append the new step to the `WorkflowDefinition.Steps` collection (preserving order).  
5. Persist the updated workflow.  
6. Return success with the new step’s ID.

**Postconditions**:
- The step is added to the workflow definition and stored in the database.  
- The UI updates to show the new step in the steps list.