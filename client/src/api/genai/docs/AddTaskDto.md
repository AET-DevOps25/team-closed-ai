# AddTaskDto

AddTaskDto

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**taskStatus** | [**TaskStatus**](TaskStatus.md) |  | [optional] [default to undefined]
**assigneeId** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { AddTaskDto } from './api';

const instance: AddTaskDto = {
    title,
    description,
    taskStatus,
    assigneeId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
