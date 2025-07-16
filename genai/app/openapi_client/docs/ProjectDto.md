# ProjectDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**name** | **str** |  | 
**color** | **str** |  | 
**created_at** | **datetime** |  | 
**updated_at** | **datetime** |  | 
**task_ids** | **List[int]** |  | 

## Example

```python
from openapi_client.models.project_dto import ProjectDto

# TODO update the JSON string below
json = "{}"
# create an instance of ProjectDto from a JSON string
project_dto_instance = ProjectDto.from_json(json)
# print the JSON string representation of the object
print(ProjectDto.to_json())

# convert the object into a dict
project_dto_dict = project_dto_instance.to_dict()
# create an instance of ProjectDto from a dict
project_dto_from_dict = ProjectDto.from_dict(project_dto_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


