# GenAIResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**intent** | **string** |  | [default to undefined]
**answer** | **string** |  | [default to undefined]
**existing_tasks** | [**Array&lt;TaskDto&gt;**](TaskDto.md) |  | [optional] [default to undefined]
**new_tasks** | [**Array&lt;AddTaskDto&gt;**](AddTaskDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { GenAIResponse } from './api';

const instance: GenAIResponse = {
    intent,
    answer,
    existing_tasks,
    new_tasks,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
