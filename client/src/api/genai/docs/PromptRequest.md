# PromptRequest

Request model for AI prompt interpretation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**project_id** | **string** | The unique identifier of the project context for the prompt | [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]
**prompt** | **string** | The natural language prompt to be interpreted by the AI | [default to undefined]

## Example

```typescript
import { PromptRequest } from './api';

const instance: PromptRequest = {
    project_id,
    user_id,
    prompt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
