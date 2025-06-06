# TaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**taskStatus** | [**TaskStatus**](TaskStatus.md) |  | [default to undefined]
**comments** | **Array&lt;string&gt;** |  | [default to undefined]
**attachments** | **Array&lt;string&gt;** |  | [default to undefined]
**assigneeId** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { TaskDto } from './api';

const instance: TaskDto = {
    id,
    title,
    description,
    taskStatus,
    comments,
    attachments,
    assigneeId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
