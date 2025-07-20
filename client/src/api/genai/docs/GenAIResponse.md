# GenAIResponse

Response model containing AI interpretation results

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**intent** | **string** | The classified intent of the prompt (generation or answering) | [default to undefined]
**answer** | **string** | Human-readable response from the AI explaining the interpretation | [default to undefined]
**existing_tasks** | [**Array&lt;TaskDto&gt;**](TaskDto.md) | List of existing tasks relevant to the prompt (used for answering intent) | [optional] [default to undefined]
**new_tasks** | [**Array&lt;AddTaskDto&gt;**](AddTaskDto.md) | List of new tasks generated based on the prompt (used for generation intent) | [optional] [default to undefined]

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
